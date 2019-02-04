"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const ajv = require("ajv");
const http = require("http");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const Url = require("url");
const exception_1 = require("../../exception/exception");
const utils_1 = require("../../utils");
const interface_1 = require("../interface");
const visitor_1 = require("./visitor");
class SchemaValidationException extends exception_1.BaseException {
    constructor(errors, baseMessage = 'Schema validation failed with the following errors:') {
        if (!errors || errors.length === 0) {
            super('Schema validation failed.');
            return;
        }
        const messages = SchemaValidationException.createMessages(errors);
        super(`${baseMessage}\n  ${messages.join('\n  ')}`);
        this.errors = errors;
    }
    static createMessages(errors) {
        if (!errors || errors.length === 0) {
            return [];
        }
        const messages = errors.map((err) => {
            let message = `Data path ${JSON.stringify(err.dataPath)} ${err.message}`;
            if (err.keyword === 'additionalProperties') {
                message += `(${err.params.additionalProperty})`;
            }
            return message + '.';
        });
        return messages;
    }
}
exports.SchemaValidationException = SchemaValidationException;
class CoreSchemaRegistry {
    constructor(formats = []) {
        /**
         * Build an AJV instance that will be used to validate schemas.
         */
        this._uriCache = new Map();
        this._uriHandlers = new Set();
        this._pre = new utils_1.PartiallyOrderedSet();
        this._post = new utils_1.PartiallyOrderedSet();
        this._smartDefaultKeyword = false;
        this._sourceMap = new Map();
        const formatsObj = {};
        for (const format of formats) {
            formatsObj[format.name] = format.formatter;
        }
        this._ajv = ajv({
            formats: formatsObj,
            loadSchema: (uri) => this._fetch(uri),
            schemaId: 'auto',
            passContext: true,
        });
        this._ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
        this._ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
    }
    _fetch(uri) {
        const maybeSchema = this._uriCache.get(uri);
        if (maybeSchema) {
            return Promise.resolve(maybeSchema);
        }
        // Try all handlers, one after the other.
        for (const maybeHandler of this._uriHandlers) {
            const handler = maybeHandler(uri);
            if (handler) {
                // The AJV API only understands Promises.
                return rxjs_1.from(handler).pipe(operators_1.tap(json => this._uriCache.set(uri, json))).toPromise();
            }
        }
        // If none are found, handle using http client.
        return new Promise((resolve, reject) => {
            http.get(uri, res => {
                if (!res.statusCode || res.statusCode >= 300) {
                    // Consume the rest of the data to free memory.
                    res.resume();
                    reject(new Error(`Request failed. Status Code: ${res.statusCode}`));
                }
                else {
                    res.setEncoding('utf8');
                    let data = '';
                    res.on('data', chunk => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        try {
                            const json = JSON.parse(data);
                            this._uriCache.set(uri, json);
                            resolve(json);
                        }
                        catch (err) {
                            reject(err);
                        }
                    });
                }
            });
        });
    }
    /**
     * Add a transformation step before the validation of any Json.
     * @param {JsonVisitor} visitor The visitor to transform every value.
     * @param {JsonVisitor[]} deps A list of other visitors to run before.
     */
    addPreTransform(visitor, deps) {
        this._pre.add(visitor, deps);
    }
    /**
     * Add a transformation step after the validation of any Json. The JSON will not be validated
     * after the POST, so if transformations are not compatible with the Schema it will not result
     * in an error.
     * @param {JsonVisitor} visitor The visitor to transform every value.
     * @param {JsonVisitor[]} deps A list of other visitors to run before.
     */
    addPostTransform(visitor, deps) {
        this._post.add(visitor, deps);
    }
    _resolver(ref, validate) {
        if (!validate || !validate.refs || !validate.refVal || !ref) {
            return {};
        }
        let refMap = validate;
        const rootRefMap = validate.root;
        // Resolve from the root if it's different.
        if (validate.root && validate.schema !== rootRefMap.schema) {
            refMap = rootRefMap;
        }
        const schema = refMap.schema ? typeof refMap.schema == 'object' && refMap.schema : null;
        const maybeId = schema ? schema.id || schema.$id : null;
        if (typeof maybeId == 'string') {
            ref = Url.resolve(maybeId, ref);
        }
        let fullReference = (ref[0] === '#' && maybeId) ? maybeId + ref : ref;
        if (fullReference.endsWith('#')) {
            fullReference = fullReference.slice(0, -1);
        }
        // tslint:disable-next-line:no-any
        const context = validate.refVal[validate.refs[fullReference]];
        if (typeof context == 'function') {
            // Context will be a function if the schema isn't loaded yet, and an actual schema if it's
            // synchronously available.
            return { context, schema: context && context.schema };
        }
        else {
            return { context: validate, schema: context };
        }
    }
    /**
     * Flatten the Schema, resolving and replacing all the refs. Makes it into a synchronous schema
     * that is also easier to traverse. Does not cache the result.
     *
     * @param schema The schema or URI to flatten.
     * @returns An Observable of the flattened schema object.
     */
    flatten(schema) {
        this._ajv.removeSchema(schema);
        // Supports both synchronous and asynchronous compilation, by trying the synchronous
        // version first, then if refs are missing this will fails.
        // We also add any refs from external fetched schemas so that those will also be used
        // in synchronous (if available).
        let validator;
        try {
            this._currentCompilationSchemaInfo = undefined;
            validator = rxjs_1.of(this._ajv.compile(schema)).pipe(operators_1.tap(() => this._currentCompilationSchemaInfo = undefined));
        }
        catch (e) {
            // Propagate the error.
            if (!(e instanceof ajv.MissingRefError)) {
                return rxjs_1.throwError(e);
            }
            this._currentCompilationSchemaInfo = undefined;
            validator = rxjs_1.from(this._ajv.compileAsync(schema)).pipe(operators_1.tap(() => this._currentCompilationSchemaInfo = undefined));
        }
        return validator.pipe(operators_1.switchMap(validate => {
            const self = this;
            function visitor(current, pointer, parentSchema, index) {
                if (current
                    && parentSchema
                    && index
                    && interface_1.isJsonObject(current)
                    && current.hasOwnProperty('$ref')
                    && typeof current['$ref'] == 'string') {
                    const resolved = self._resolver(current['$ref'], validate);
                    if (resolved.schema) {
                        parentSchema[index] = resolved.schema;
                    }
                }
            }
            const schema = utils_1.deepCopy(validate.schema);
            visitor_1.visitJsonSchema(schema, visitor);
            return rxjs_1.of(schema);
        }));
    }
    /**
     * Compile and return a validation function for the Schema.
     *
     * @param schema The schema to validate. If a string, will fetch the schema before compiling it
     * (using schema as a URI).
     * @returns An Observable of the Validation function.
     */
    compile(schema) {
        const schemaInfo = {
            smartDefaultRecord: new Map(),
            promptDefinitions: [],
        };
        this._ajv.removeSchema(schema);
        // Supports both synchronous and asynchronous compilation, by trying the synchronous
        // version first, then if refs are missing this will fails.
        // We also add any refs from external fetched schemas so that those will also be used
        // in synchronous (if available).
        let validator;
        try {
            this._currentCompilationSchemaInfo = schemaInfo;
            validator = rxjs_1.of(this._ajv.compile(schema));
        }
        catch (e) {
            // Propagate the error.
            if (!(e instanceof ajv.MissingRefError)) {
                return rxjs_1.throwError(e);
            }
            try {
                validator = rxjs_1.from(this._ajv.compileAsync(schema));
            }
            catch (e) {
                return rxjs_1.throwError(e);
            }
        }
        return validator
            .pipe(operators_1.map(validate => (data, options) => {
            const validationOptions = Object.assign({ withPrompts: true, applyPostTransforms: true, applyPreTransforms: true }, options);
            const validationContext = {
                promptFieldsWithValue: new Set(),
            };
            let result = rxjs_1.of(data);
            if (validationOptions.applyPreTransforms) {
                // tslint:disable-next-line:no-any https://github.com/ReactiveX/rxjs/issues/3989
                result = result.pipe(...[...this._pre].map(visitor => operators_1.concatMap((data) => {
                    if (schema === false || schema === true) {
                        return rxjs_1.of(data);
                    }
                    return visitor_1.visitJson(data, visitor, schema, this._resolver, validate);
                })));
            }
            return result.pipe(operators_1.switchMap(updateData => this._applySmartDefaults(updateData, schemaInfo.smartDefaultRecord)), operators_1.switchMap(updatedData => {
                if (validationOptions.withPrompts === false) {
                    return rxjs_1.of(updatedData);
                }
                const visitor = (value, pointer) => {
                    if (value !== undefined) {
                        validationContext.promptFieldsWithValue.add(pointer);
                    }
                    return value;
                };
                if (schema === false || schema === true) {
                    return rxjs_1.of(updatedData);
                }
                return visitor_1.visitJson(updatedData, visitor, schema, this._resolver, validate);
            }), operators_1.switchMap(updatedData => {
                if (validationOptions.withPrompts === false) {
                    return rxjs_1.of(updatedData);
                }
                const definitions = schemaInfo.promptDefinitions
                    .filter(def => !validationContext.promptFieldsWithValue.has(def.id));
                if (this._promptProvider && definitions.length > 0) {
                    return rxjs_1.from(this._applyPrompts(updatedData, definitions));
                }
                else {
                    return rxjs_1.of(updatedData);
                }
            }), operators_1.switchMap(updatedData => {
                const result = validate.call(validationContext, updatedData);
                return typeof result == 'boolean'
                    ? rxjs_1.of([updatedData, result])
                    : rxjs_1.from(result
                        .then(r => [updatedData, true])
                        .catch((err) => {
                        if (err.ajv) {
                            validate.errors = err.errors;
                            return Promise.resolve([updatedData, false]);
                        }
                        return Promise.reject(err);
                    }));
            }), operators_1.switchMap(([data, valid]) => {
                if (valid) {
                    let result = rxjs_1.of(data);
                    if (validationOptions.applyPostTransforms) {
                        // tslint:disable-next-line:no-any https://github.com/ReactiveX/rxjs/issues/3989
                        result = result.pipe(...[...this._post].map(visitor => operators_1.concatMap((data) => {
                            if (schema === false || schema === true) {
                                return rxjs_1.of(schema);
                            }
                            return visitor_1.visitJson(data, visitor, schema, this._resolver, validate);
                        })));
                    }
                    return result.pipe(operators_1.map(data => [data, valid]));
                }
                else {
                    return rxjs_1.of([data, valid]);
                }
            }), operators_1.map(([data, valid]) => {
                if (valid) {
                    return { data, success: true };
                }
                return {
                    data,
                    success: false,
                    errors: (validate.errors || []),
                };
            }));
        }));
    }
    addFormat(format) {
        // tslint:disable-next-line:no-any
        const validate = (data) => {
            const result = format.formatter.validate(data);
            if (typeof result == 'boolean') {
                return result;
            }
            else {
                return result.toPromise();
            }
        };
        this._ajv.addFormat(format.name, {
            async: format.formatter.async,
            validate,
        });
    }
    addSmartDefaultProvider(source, provider) {
        if (this._sourceMap.has(source)) {
            throw new Error(source);
        }
        this._sourceMap.set(source, provider);
        if (!this._smartDefaultKeyword) {
            this._smartDefaultKeyword = true;
            this._ajv.addKeyword('$default', {
                errors: false,
                valid: true,
                compile: (schema, _parentSchema, it) => {
                    const compilationSchemInfo = this._currentCompilationSchemaInfo;
                    if (compilationSchemInfo === undefined) {
                        return () => true;
                    }
                    // We cheat, heavily.
                    compilationSchemInfo.smartDefaultRecord.set(
                    // tslint:disable-next-line:no-any
                    JSON.stringify(it.dataPathArr.slice(1, it.dataLevel + 1)), schema);
                    return () => true;
                },
                metaSchema: {
                    type: 'object',
                    properties: {
                        '$source': { type: 'string' },
                    },
                    additionalProperties: true,
                    required: ['$source'],
                },
            });
        }
    }
    registerUriHandler(handler) {
        this._uriHandlers.add(handler);
    }
    usePromptProvider(provider) {
        const isSetup = !!this._promptProvider;
        this._promptProvider = provider;
        if (isSetup) {
            return;
        }
        this._ajv.addKeyword('x-prompt', {
            errors: false,
            valid: true,
            compile: (schema, parentSchema, it) => {
                const compilationSchemInfo = this._currentCompilationSchemaInfo;
                if (!compilationSchemInfo) {
                    return () => true;
                }
                // tslint:disable-next-line:no-any
                const pathArray = it.dataPathArr.slice(1, it.dataLevel + 1);
                const path = '/' + pathArray.map(p => p.replace(/^\'/, '').replace(/\'$/, '')).join('/');
                let type;
                let items;
                let message;
                if (typeof schema == 'string') {
                    message = schema;
                }
                else {
                    message = schema.message;
                    type = schema.type;
                    items = schema.items;
                }
                if (!type) {
                    if (parentSchema.type === 'boolean') {
                        type = 'confirmation';
                    }
                    else if (Array.isArray(parentSchema.enum)) {
                        type = 'list';
                    }
                    else {
                        type = 'input';
                    }
                }
                if (type === 'list' && !items) {
                    if (Array.isArray(parentSchema.enum)) {
                        type = 'list';
                        items = [];
                        for (const value of parentSchema.enum) {
                            if (typeof value == 'string') {
                                items.push(value);
                            }
                            else if (typeof value == 'object') {
                                // Invalid
                            }
                            else {
                                items.push({ label: value.toString(), value });
                            }
                        }
                    }
                }
                const definition = {
                    id: path,
                    type,
                    message,
                    priority: 0,
                    raw: schema,
                    items,
                    multiselect: type === 'list' ? schema.multiselect : false,
                    default: typeof parentSchema.default == 'object' ? undefined : parentSchema.default,
                    async validator(data) {
                        const result = it.self.validate(parentSchema, data);
                        if (typeof result === 'boolean') {
                            return result;
                        }
                        else {
                            try {
                                await result;
                                return true;
                            }
                            catch (_a) {
                                return false;
                            }
                        }
                    },
                };
                compilationSchemInfo.promptDefinitions.push(definition);
                return function () {
                    // If 'this' is undefined in the call, then it defaults to the global
                    // 'this'.
                    if (this && this.promptFieldsWithValue) {
                        this.promptFieldsWithValue.add(path);
                    }
                    return true;
                };
            },
            metaSchema: {
                oneOf: [
                    { type: 'string' },
                    {
                        type: 'object',
                        properties: {
                            'type': { type: 'string' },
                            'message': { type: 'string' },
                        },
                        additionalProperties: true,
                        required: ['message'],
                    },
                ],
            },
        });
    }
    _applyPrompts(data, prompts) {
        const provider = this._promptProvider;
        if (!provider) {
            return rxjs_1.of(data);
        }
        prompts.sort((a, b) => b.priority - a.priority);
        return rxjs_1.from(provider(prompts)).pipe(operators_1.map(answers => {
            for (const path in answers) {
                const pathFragments = path.split('/').map(pf => {
                    if (/^\d+$/.test(pf)) {
                        return pf;
                    }
                    else {
                        return '\'' + pf + '\'';
                    }
                });
                CoreSchemaRegistry._set(data, pathFragments.slice(1), answers[path], null, undefined, true);
            }
            return data;
        }));
    }
    static _set(
    // tslint:disable-next-line:no-any
    data, fragments, value, 
    // tslint:disable-next-line:no-any
    parent = null, parentProperty, force) {
        for (let i = 0; i < fragments.length; i++) {
            const f = fragments[i];
            if (f[0] == 'i') {
                if (!Array.isArray(data)) {
                    return;
                }
                for (let j = 0; j < data.length; j++) {
                    CoreSchemaRegistry._set(data[j], fragments.slice(i + 1), value, data, '' + j);
                }
                return;
            }
            else if (f.startsWith('key')) {
                if (typeof data !== 'object') {
                    return;
                }
                Object.getOwnPropertyNames(data).forEach(property => {
                    CoreSchemaRegistry._set(data[property], fragments.slice(i + 1), value, data, property);
                });
                return;
            }
            else if (f.startsWith('\'') && f[f.length - 1] == '\'') {
                const property = f
                    .slice(1, -1)
                    .replace(/\\'/g, '\'')
                    .replace(/\\n/g, '\n')
                    .replace(/\\r/g, '\r')
                    .replace(/\\f/g, '\f')
                    .replace(/\\t/g, '\t');
                // We know we need an object because the fragment is a property key.
                if (!data && parent !== null && parentProperty) {
                    data = parent[parentProperty] = {};
                }
                parent = data;
                parentProperty = property;
                data = data[property];
            }
            else {
                return;
            }
        }
        if (parent && parentProperty && (force || parent[parentProperty] === undefined)) {
            parent[parentProperty] = value;
        }
    }
    _applySmartDefaults(data, smartDefaults) {
        // tslint:disable-next-line:no-any https://github.com/ReactiveX/rxjs/issues/3989
        return rxjs_1.of(data).pipe(...[...smartDefaults.entries()].map(([pointer, schema]) => {
            return operators_1.concatMap(data => {
                const fragments = JSON.parse(pointer);
                const source = this._sourceMap.get(schema.$source);
                let value = source ? source(schema) : rxjs_1.of(undefined);
                if (!utils_1.isObservable(value)) {
                    value = rxjs_1.of(value);
                }
                return value.pipe(
                // Synchronously set the new data at the proper JsonSchema path.
                operators_1.tap(x => CoreSchemaRegistry._set(data, fragments, x)), 
                // But return the data object.
                operators_1.map(() => data));
            });
        }));
    }
}
exports.CoreSchemaRegistry = CoreSchemaRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2pzb24vc2NoZW1hL3JlZ2lzdHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsMkJBQTJCO0FBQzNCLDZCQUE2QjtBQUM3QiwrQkFBd0Q7QUFDeEQsOENBQWdFO0FBQ2hFLDJCQUEyQjtBQUMzQix5REFBMEQ7QUFDMUQsdUNBQTBFO0FBQzFFLDRDQUE4RTtBQWdCOUUsdUNBQXVEO0FBbUJ2RCxNQUFhLHlCQUEwQixTQUFRLHlCQUFhO0lBRzFELFlBQ0UsTUFBK0IsRUFDL0IsV0FBVyxHQUFHLHFEQUFxRDtRQUVuRSxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1lBRW5DLE9BQU87U0FDUjtRQUVELE1BQU0sUUFBUSxHQUFHLHlCQUF5QixDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRSxLQUFLLENBQUMsR0FBRyxXQUFXLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBK0I7UUFDMUQsSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNsQyxPQUFPLEVBQUUsQ0FBQztTQUNYO1FBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2xDLElBQUksT0FBTyxHQUFHLGFBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRSxD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R0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBRSxNQUFxQixDQUFDLE9BQWlCLENBQUMsQ0FBQztnQkFFN0UsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFcEQsSUFBSSxDQUFDLG9CQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ3hCLEtBQUssR0FBRyxTQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ25CO2dCQUVELE9BQVEsS0FBd0IsQ0FBQyxJQUFJO2dCQUNuQyxnRUFBZ0U7Z0JBQ2hFLGVBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCw4QkFBOEI7Z0JBQzlCLGVBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FDaEIsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXBwQkQsZ0RBb3BCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIGFqdiBmcm9tICdhanYnO1xuaW1wb3J0ICogYXMgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUsIGZyb20sIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjb25jYXRNYXAsIG1hcCwgc3dpdGNoTWFwLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgKiBhcyBVcmwgZnJvbSAndXJsJztcbmltcG9ydCB7IEJhc2VFeGNlcHRpb24gfSBmcm9tICcuLi8uLi9leGNlcHRpb24vZXhjZXB0aW9uJztcbmltcG9ydCB7IFBhcnRpYWxseU9yZGVyZWRTZXQsIGRlZXBDb3B5LCBpc09ic2VydmFibGUgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgeyBKc29uQXJyYXksIEpzb25PYmplY3QsIEpzb25WYWx1ZSwgaXNKc29uT2JqZWN0IH0gZnJvbSAnLi4vaW50ZXJmYWNlJztcbmltcG9ydCB7XG4gIEpzb25Qb2ludGVyLFxuICBKc29uVmlzaXRvcixcbiAgUHJvbXB0RGVmaW5pdGlvbixcbiAgUHJvbXB0UHJvdmlkZXIsXG4gIFNjaGVtYUZvcm1hdCxcbiAgU2NoZW1hRm9ybWF0dGVyLFxuICBTY2hlbWFSZWdpc3RyeSxcbiAgU2NoZW1hVmFsaWRhdG9yLFxuICBTY2hlbWFWYWxpZGF0b3JFcnJvcixcbiAgU2NoZW1hVmFsaWRhdG9yT3B0aW9ucyxcbiAgU2NoZW1hVmFsaWRhdG9yUmVzdWx0LFxuICBTbWFydERlZmF1bHRQcm92aWRlcixcbn0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSnNvblNjaGVtYSB9IGZyb20gJy4vc2NoZW1hJztcbmltcG9ydCB7IHZpc2l0SnNvbiwgdmlzaXRKc29uU2NoZW1hIH0gZnJvbSAnLi92aXNpdG9yJztcblxuLy8gVGhpcyBpbnRlcmZhY2Ugc2hvdWxkIGJlIGV4cG9ydGVkIGZyb20gYWp2LCBidXQgdGhleSBvbmx5IGV4cG9ydCB0aGUgY2xhc3MgYW5kIG5vdCB0aGUgdHlwZS5cbmludGVyZmFjZSBBanZWYWxpZGF0aW9uRXJyb3Ige1xuICBtZXNzYWdlOiBzdHJpbmc7XG4gIGVycm9yczogQXJyYXk8YWp2LkVycm9yT2JqZWN0PjtcbiAgYWp2OiB0cnVlO1xuICB2YWxpZGF0aW9uOiB0cnVlO1xufVxuXG5pbnRlcmZhY2UgQWp2UmVmTWFwIHtcbiAgcmVmczogc3RyaW5nW107XG4gIHJlZlZhbDogYW55OyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWFueVxuICBzY2hlbWE6IEpzb25PYmplY3Q7XG59XG5cbmV4cG9ydCB0eXBlIFVyaUhhbmRsZXIgPSAodXJpOiBzdHJpbmcpID0+XG4gIE9ic2VydmFibGU8SnNvbk9iamVjdD4gfCBQcm9taXNlPEpzb25PYmplY3Q+IHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IGNsYXNzIFNjaGVtYVZhbGlkYXRpb25FeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgcHVibGljIHJlYWRvbmx5IGVycm9yczogU2NoZW1hVmFsaWRhdG9yRXJyb3JbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlcnJvcnM/OiBTY2hlbWFWYWxpZGF0b3JFcnJvcltdLFxuICAgIGJhc2VNZXNzYWdlID0gJ1NjaGVtYSB2YWxpZGF0aW9uIGZhaWxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgZXJyb3JzOicsXG4gICkge1xuICAgIGlmICghZXJyb3JzIHx8IGVycm9ycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHN1cGVyKCdTY2hlbWEgdmFsaWRhdGlvbiBmYWlsZWQuJyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlcyA9IFNjaGVtYVZhbGlkYXRpb25FeGNlcHRpb24uY3JlYXRlTWVzc2FnZXMoZXJyb3JzKTtcbiAgICBzdXBlcihgJHtiYXNlTWVzc2FnZX1cXG4gICR7bWVzc2FnZXMuam9pbignXFxuICAnKX1gKTtcbiAgICB0aGlzLmVycm9ycyA9IGVycm9ycztcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgY3JlYXRlTWVzc2FnZXMoZXJyb3JzPzogU2NoZW1hVmFsaWRhdG9yRXJyb3JbXSk6IHN0cmluZ1tdIHtcbiAgICBpZiAoIWVycm9ycyB8fCBlcnJvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZXMgPSBlcnJvcnMubWFwKChlcnIpID0+IHtcbiAgICAgIGxldCBtZXNzYWdlID0gYERhdGEgcGF0aCAke0pTT04uc3RyaW5naWZ5KGVyci5kYXRhUGF0aCl9ICR7ZXJyLm1lc3NhZ2V9YDtcbiAgICAgIGlmIChlcnIua2V5d29yZCA9PT0gJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJykge1xuICAgICAgICBtZXNzYWdlICs9IGAoJHtlcnIucGFyYW1zLmFkZGl0aW9uYWxQcm9wZXJ0eX0pYDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1lc3NhZ2UgKyAnLic7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWVzc2FnZXM7XG4gIH1cbn1cblxuaW50ZXJmYWNlIFNjaGVtYUluZm8ge1xuICBzbWFydERlZmF1bHRSZWNvcmQ6IE1hcDxzdHJpbmcsIEpzb25PYmplY3Q+O1xuICBwcm9tcHREZWZpbml0aW9uczogQXJyYXk8UHJvbXB0RGVmaW5pdGlvbj47XG59XG5cbmV4cG9ydCBjbGFzcyBDb3JlU2NoZW1hUmVnaXN0cnkgaW1wbGVtZW50cyBTY2hlbWFSZWdpc3RyeSB7XG4gIHByaXZhdGUgX2FqdjogYWp2LkFqdjtcbiAgcHJpdmF0ZSBfdXJpQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgSnNvbk9iamVjdD4oKTtcbiAgcHJpdmF0ZSBfdXJpSGFuZGxlcnMgPSBuZXcgU2V0PFVyaUhhbmRsZXI+KCk7XG4gIHByaXZhdGUgX3ByZSA9IG5ldyBQYXJ0aWFsbHlPcmRlcmVkU2V0PEpzb25WaXNpdG9yPigpO1xuICBwcml2YXRlIF9wb3N0ID0gbmV3IFBhcnRpYWxseU9yZGVyZWRTZXQ8SnNvblZpc2l0b3I+KCk7XG5cbiAgcHJpdmF0ZSBfY3VycmVudENvbXBpbGF0aW9uU2NoZW1hSW5mbz86IFNjaGVtYUluZm87XG5cbiAgcHJpdmF0ZSBfc21hcnREZWZhdWx0S2V5d29yZCA9IGZhbHNlO1xuICBwcml2YXRlIF9wcm9tcHRQcm92aWRlcj86IFByb21wdFByb3ZpZGVyO1xuICBwcml2YXRlIF9zb3VyY2VNYXAgPSBuZXcgTWFwPHN0cmluZywgU21hcnREZWZhdWx0UHJvdmlkZXI8e30+PigpO1xuXG4gIGNvbnN0cnVjdG9yKGZvcm1hdHM6IFNjaGVtYUZvcm1hdFtdID0gW10pIHtcbiAgICAvKipcbiAgICAgKiBCdWlsZCBhbiBBSlYgaW5zdGFuY2UgdGhhdCB3aWxsIGJlIHVzZWQgdG8gdmFsaWRhdGUgc2NoZW1hcy5cbiAgICAgKi9cblxuICAgIGNvbnN0IGZvcm1hdHNPYmo6IHsgW25hbWU6IHN0cmluZ106IFNjaGVtYUZvcm1hdHRlciB9ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGZvcm1hdCBvZiBmb3JtYXRzKSB7XG4gICAgICBmb3JtYXRzT2JqW2Zvcm1hdC5uYW1lXSA9IGZvcm1hdC5mb3JtYXR0ZXI7XG4gICAgfVxuXG4gICAgdGhpcy5fYWp2ID0gYWp2KHtcbiAgICAgIGZvcm1hdHM6IGZvcm1hdHNPYmosXG4gICAgICBsb2FkU2NoZW1hOiAodXJpOiBzdHJpbmcpID0+IHRoaXMuX2ZldGNoKHVyaSksXG4gICAgICBzY2hlbWFJZDogJ2F1dG8nLFxuICAgICAgcGFzc0NvbnRleHQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLl9hanYuYWRkTWV0YVNjaGVtYShyZXF1aXJlKCdhanYvbGliL3JlZnMvanNvbi1zY2hlbWEtZHJhZnQtMDQuanNvbicpKTtcbiAgICB0aGlzLl9hanYuYWRkTWV0YVNjaGVtYShyZXF1aXJlKCdhanYvbGliL3JlZnMvanNvbi1zY2hlbWEtZHJhZnQtMDYuanNvbicpKTtcbiAgfVxuXG4gIHByaXZhdGUgX2ZldGNoKHVyaTogc3RyaW5nKTogUHJvbWlzZTxKc29uT2JqZWN0PiB7XG4gICAgY29uc3QgbWF5YmVTY2hlbWEgPSB0aGlzLl91cmlDYWNoZS5nZXQodXJpKTtcblxuICAgIGlmIChtYXliZVNjaGVtYSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShtYXliZVNjaGVtYSk7XG4gICAgfVxuXG4gICAgLy8gVHJ5IGFsbCBoYW5kbGVycywgb25lIGFmdGVyIHRoZSBvdGhlci5cbiAgICBmb3IgKGNvbnN0IG1heWJlSGFuZGxlciBvZiB0aGlzLl91cmlIYW5kbGVycykge1xuICAgICAgY29uc3QgaGFuZGxlciA9IG1heWJlSGFuZGxlcih1cmkpO1xuICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgLy8gVGhlIEFKViBBUEkgb25seSB1bmRlcnN0YW5kcyBQcm9taXNlcy5cbiAgICAgICAgcmV0dXJuIGZyb20oaGFuZGxlcikucGlwZShcbiAgICAgICAgICB0YXAoanNvbiA9PiB0aGlzLl91cmlDYWNoZS5zZXQodXJpLCBqc29uKSksXG4gICAgICAgICkudG9Qcm9taXNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgbm9uZSBhcmUgZm91bmQsIGhhbmRsZSB1c2luZyBodHRwIGNsaWVudC5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8SnNvbk9iamVjdD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaHR0cC5nZXQodXJpLCByZXMgPT4ge1xuICAgICAgICBpZiAoIXJlcy5zdGF0dXNDb2RlIHx8IHJlcy5zdGF0dXNDb2RlID49IDMwMCkge1xuICAgICAgICAgIC8vIENvbnN1bWUgdGhlIHJlc3Qgb2YgdGhlIGRhdGEgdG8gZnJlZSBtZW1vcnkuXG4gICAgICAgICAgcmVzLnJlc3VtZSgpO1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoYFJlcXVlc3QgZmFpbGVkLiBTdGF0dXMgQ29kZTogJHtyZXMuc3RhdHVzQ29kZX1gKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzLnNldEVuY29kaW5nKCd1dGY4Jyk7XG4gICAgICAgICAgbGV0IGRhdGEgPSAnJztcbiAgICAgICAgICByZXMub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgICAgICAgICBkYXRhICs9IGNodW5rO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlcy5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICAgIHRoaXMuX3VyaUNhY2hlLnNldCh1cmksIGpzb24pO1xuICAgICAgICAgICAgICByZXNvbHZlKGpzb24pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSB0cmFuc2Zvcm1hdGlvbiBzdGVwIGJlZm9yZSB0aGUgdmFsaWRhdGlvbiBvZiBhbnkgSnNvbi5cbiAgICogQHBhcmFtIHtKc29uVmlzaXRvcn0gdmlzaXRvciBUaGUgdmlzaXRvciB0byB0cmFuc2Zvcm0gZXZlcnkgdmFsdWUuXG4gICAqIEBwYXJhbSB7SnNvblZpc2l0b3JbXX0gZGVwcyBBIGxpc3Qgb2Ygb3RoZXIgdmlzaXRvcnMgdG8gcnVuIGJlZm9yZS5cbiAgICovXG4gIGFkZFByZVRyYW5zZm9ybSh2aXNpdG9yOiBKc29uVmlzaXRvciwgZGVwcz86IEpzb25WaXNpdG9yW10pIHtcbiAgICB0aGlzLl9wcmUuYWRkKHZpc2l0b3IsIGRlcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHRyYW5zZm9ybWF0aW9uIHN0ZXAgYWZ0ZXIgdGhlIHZhbGlkYXRpb24gb2YgYW55IEpzb24uIFRoZSBKU09OIHdpbGwgbm90IGJlIHZhbGlkYXRlZFxuICAgKiBhZnRlciB0aGUgUE9TVCwgc28gaWYgdHJhbnNmb3JtYXRpb25zIGFyZSBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSBTY2hlbWEgaXQgd2lsbCBub3QgcmVzdWx0XG4gICAqIGluIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge0pzb25WaXNpdG9yfSB2aXNpdG9yIFRoZSB2aXNpdG9yIHRvIHRyYW5zZm9ybSBldmVyeSB2YWx1ZS5cbiAgICogQHBhcmFtIHtKc29uVmlzaXRvcltdfSBkZXBzIEEgbGlzdCBvZiBvdGhlciB2aXNpdG9ycyB0byBydW4gYmVmb3JlLlxuICAgKi9cbiAgYWRkUG9zdFRyYW5zZm9ybSh2aXNpdG9yOiBKc29uVmlzaXRvciwgZGVwcz86IEpzb25WaXNpdG9yW10pIHtcbiAgICB0aGlzLl9wb3N0LmFkZCh2aXNpdG9yLCBkZXBzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcmVzb2x2ZXIoXG4gICAgcmVmOiBzdHJpbmcsXG4gICAgdmFsaWRhdGU6IGFqdi5WYWxpZGF0ZUZ1bmN0aW9uLFxuICApOiB7IGNvbnRleHQ/OiBhanYuVmFsaWRhdGVGdW5jdGlvbiwgc2NoZW1hPzogSnNvbk9iamVjdCB9IHtcbiAgICBpZiAoIXZhbGlkYXRlIHx8ICF2YWxpZGF0ZS5yZWZzIHx8ICF2YWxpZGF0ZS5yZWZWYWwgfHwgIXJlZikge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGxldCByZWZNYXAgPSB2YWxpZGF0ZSBhcyBBanZSZWZNYXA7XG4gICAgY29uc3Qgcm9vdFJlZk1hcCA9IHZhbGlkYXRlLnJvb3QgYXMgQWp2UmVmTWFwO1xuXG4gICAgLy8gUmVzb2x2ZSBmcm9tIHRoZSByb290IGlmIGl0J3MgZGlmZmVyZW50LlxuICAgIGlmICh2YWxpZGF0ZS5yb290ICYmIHZhbGlkYXRlLnNjaGVtYSAhPT0gcm9vdFJlZk1hcC5zY2hlbWEpIHtcbiAgICAgIHJlZk1hcCA9IHJvb3RSZWZNYXA7XG4gICAgfVxuXG4gICAgY29uc3Qgc2NoZW1hID0gcmVmTWFwLnNjaGVtYSA/IHR5cGVvZiByZWZNYXAuc2NoZW1hID09ICdvYmplY3QnICYmIHJlZk1hcC5zY2hlbWEgOiBudWxsO1xuICAgIGNvbnN0IG1heWJlSWQgPSBzY2hlbWEgPyAoc2NoZW1hIGFzIEpzb25PYmplY3QpLmlkIHx8IChzY2hlbWEgYXMgSnNvbk9iamVjdCkuJGlkIDogbnVsbDtcblxuICAgIGlmICh0eXBlb2YgbWF5YmVJZCA9PSAnc3RyaW5nJykge1xuICAgICAgcmVmID0gVXJsLnJlc29sdmUobWF5YmVJZCwgcmVmKTtcbiAgICB9XG5cbiAgICBsZXQgZnVsbFJlZmVyZW5jZSA9IChyZWZbMF0gPT09ICcjJyAmJiBtYXliZUlkKSA/IG1heWJlSWQgKyByZWYgOiByZWY7XG4gICAgaWYgKGZ1bGxSZWZlcmVuY2UuZW5kc1dpdGgoJyMnKSkge1xuICAgICAgZnVsbFJlZmVyZW5jZSA9IGZ1bGxSZWZlcmVuY2Uuc2xpY2UoMCwgLTEpO1xuICAgIH1cblxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBjb25zdCBjb250ZXh0ID0gdmFsaWRhdGUucmVmVmFsWyh2YWxpZGF0ZS5yZWZzIGFzIGFueSlbZnVsbFJlZmVyZW5jZV1dO1xuXG4gICAgaWYgKHR5cGVvZiBjb250ZXh0ID09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIENvbnRleHQgd2lsbCBiZSBhIGZ1bmN0aW9uIGlmIHRoZSBzY2hlbWEgaXNuJ3QgbG9hZGVkIHlldCwgYW5kIGFuIGFjdHVhbCBzY2hlbWEgaWYgaXQnc1xuICAgICAgLy8gc3luY2hyb25vdXNseSBhdmFpbGFibGUuXG4gICAgICByZXR1cm4geyBjb250ZXh0LCBzY2hlbWE6IGNvbnRleHQgJiYgY29udGV4dC5zY2hlbWEgYXMgSnNvbk9iamVjdCB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyBjb250ZXh0OiB2YWxpZGF0ZSwgc2NoZW1hOiBjb250ZXh0IGFzIEpzb25PYmplY3QgfTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmxhdHRlbiB0aGUgU2NoZW1hLCByZXNvbHZpbmcgYW5kIHJlcGxhY2luZyBhbGwgdGhlIHJlZnMuIE1ha2VzIGl0IGludG8gYSBzeW5jaHJvbm91cyBzY2hlbWFcbiAgICogdGhhdCBpcyBhbHNvIGVhc2llciB0byB0cmF2ZXJzZS4gRG9lcyBub3QgY2FjaGUgdGhlIHJlc3VsdC5cbiAgICpcbiAgICogQHBhcmFtIHNjaGVtYSBUaGUgc2NoZW1hIG9yIFVSSSB0byBmbGF0dGVuLlxuICAgKiBAcmV0dXJucyBBbiBPYnNlcnZhYmxlIG9mIHRoZSBmbGF0dGVuZWQgc2NoZW1hIG9iamVjdC5cbiAgICovXG4gIGZsYXR0ZW4oc2NoZW1hOiBKc29uT2JqZWN0KTogT2JzZXJ2YWJsZTxKc29uT2JqZWN0PiB7XG4gICAgdGhpcy5fYWp2LnJlbW92ZVNjaGVtYShzY2hlbWEpO1xuXG4gICAgLy8gU3VwcG9ydHMgYm90aCBzeW5jaHJvbm91cyBhbmQgYXN5bmNocm9ub3VzIGNvbXBpbGF0aW9uLCBieSB0cnlpbmcgdGhlIHN5bmNocm9ub3VzXG4gICAgLy8gdmVyc2lvbiBmaXJzdCwgdGhlbiBpZiByZWZzIGFyZSBtaXNzaW5nIHRoaXMgd2lsbCBmYWlscy5cbiAgICAvLyBXZSBhbHNvIGFkZCBhbnkgcmVmcyBmcm9tIGV4dGVybmFsIGZldGNoZWQgc2NoZW1hcyBzbyB0aGF0IHRob3NlIHdpbGwgYWxzbyBiZSB1c2VkXG4gICAgLy8gaW4gc3luY2hyb25vdXMgKGlmIGF2YWlsYWJsZSkuXG4gICAgbGV0IHZhbGlkYXRvcjogT2JzZXJ2YWJsZTxhanYuVmFsaWRhdGVGdW5jdGlvbj47XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2N1cnJlbnRDb21waWxhdGlvblNjaGVtYUluZm8gPSB1bmRlZmluZWQ7XG4gICAgICB2YWxpZGF0b3IgPSBvZih0aGlzLl9hanYuY29tcGlsZShzY2hlbWEpKS5waXBlKFxuICAgICAgICB0YXAoKCkgPT4gdGhpcy5fY3VycmVudENvbXBpbGF0aW9uU2NoZW1hSW5mbyA9IHVuZGVmaW5lZCksXG4gICAgICApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIFByb3BhZ2F0ZSB0aGUgZXJyb3IuXG4gICAgICBpZiAoIShlIGluc3RhbmNlb2YgKGFqdi5NaXNzaW5nUmVmRXJyb3IgYXMge30gYXMgRnVuY3Rpb24pKSkge1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY3VycmVudENvbXBpbGF0aW9uU2NoZW1hSW5mbyA9IHVuZGVmaW5lZDtcbiAgICAgIHZhbGlkYXRvciA9IGZyb20odGhpcy5fYWp2LmNvbXBpbGVBc3luYyhzY2hlbWEpKS5waXBlKFxuICAgICAgICB0YXAoKCkgPT4gdGhpcy5fY3VycmVudENvbXBpbGF0aW9uU2NoZW1hSW5mbyA9IHVuZGVmaW5lZCksXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxpZGF0b3IucGlwZShcbiAgICAgIHN3aXRjaE1hcCh2YWxpZGF0ZSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGZ1bmN0aW9uIHZpc2l0b3IoXG4gICAgICAgICAgY3VycmVudDogSnNvbk9iamVjdCB8IEpzb25BcnJheSxcbiAgICAgICAgICBwb2ludGVyOiBKc29uUG9pbnRlcixcbiAgICAgICAgICBwYXJlbnRTY2hlbWE/OiBKc29uT2JqZWN0IHwgSnNvbkFycmF5LFxuICAgICAgICAgIGluZGV4Pzogc3RyaW5nLFxuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoY3VycmVudFxuICAgICAgICAgICAgJiYgcGFyZW50U2NoZW1hXG4gICAgICAgICAgICAmJiBpbmRleFxuICAgICAgICAgICAgJiYgaXNKc29uT2JqZWN0KGN1cnJlbnQpXG4gICAgICAgICAgICAmJiBjdXJyZW50Lmhhc093blByb3BlcnR5KCckcmVmJylcbiAgICAgICAgICAgICYmIHR5cGVvZiBjdXJyZW50WyckcmVmJ10gPT0gJ3N0cmluZydcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc29sdmVkID0gc2VsZi5fcmVzb2x2ZXIoY3VycmVudFsnJHJlZiddIGFzIHN0cmluZywgdmFsaWRhdGUpO1xuXG4gICAgICAgICAgICBpZiAocmVzb2x2ZWQuc2NoZW1hKSB7XG4gICAgICAgICAgICAgIChwYXJlbnRTY2hlbWEgYXMgSnNvbk9iamVjdClbaW5kZXhdID0gcmVzb2x2ZWQuc2NoZW1hO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNjaGVtYSA9IGRlZXBDb3B5KHZhbGlkYXRlLnNjaGVtYSBhcyBKc29uT2JqZWN0KTtcbiAgICAgICAgdmlzaXRKc29uU2NoZW1hKHNjaGVtYSwgdmlzaXRvcik7XG5cbiAgICAgICAgcmV0dXJuIG9mKHNjaGVtYSk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXBpbGUgYW5kIHJldHVybiBhIHZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIHRoZSBTY2hlbWEuXG4gICAqXG4gICAqIEBwYXJhbSBzY2hlbWEgVGhlIHNjaGVtYSB0byB2YWxpZGF0ZS4gSWYgYSBzdHJpbmcsIHdpbGwgZmV0Y2ggdGhlIHNjaGVtYSBiZWZvcmUgY29tcGlsaW5nIGl0XG4gICAqICh1c2luZyBzY2hlbWEgYXMgYSBVUkkpLlxuICAgKiBAcmV0dXJucyBBbiBPYnNlcnZhYmxlIG9mIHRoZSBWYWxpZGF0aW9uIGZ1bmN0aW9uLlxuICAgKi9cbiAgY29tcGlsZShzY2hlbWE6IEpzb25TY2hlbWEpOiBPYnNlcnZhYmxlPFNjaGVtYVZhbGlkYXRvcj4ge1xuICAgIGNvbnN0IHNjaGVtYUluZm86IFNjaGVtYUluZm8gPSB7XG4gICAgICBzbWFydERlZmF1bHRSZWNvcmQ6IG5ldyBNYXA8c3RyaW5nLCBKc29uT2JqZWN0PigpLFxuICAgICAgcHJvbXB0RGVmaW5pdGlvbnM6IFtdLFxuICAgIH07XG5cbiAgICB0aGlzLl9hanYucmVtb3ZlU2NoZW1hKHNjaGVtYSk7XG5cbiAgICAvLyBTdXBwb3J0cyBib3RoIHN5bmNocm9ub3VzIGFuZCBhc3luY2hyb25vdXMgY29tcGlsYXRpb24sIGJ5IHRyeWluZyB0aGUgc3luY2hyb25vdXNcbiAgICAvLyB2ZXJzaW9uIGZpcnN0LCB0aGVuIGlmIHJlZnMgYXJlIG1pc3NpbmcgdGhpcyB3aWxsIGZhaWxzLlxuICAgIC8vIFdlIGFsc28gYWRkIGFueSByZWZzIGZyb20gZXh0ZXJuYWwgZmV0Y2hlZCBzY2hlbWFzIHNvIHRoYXQgdGhvc2Ugd2lsbCBhbHNvIGJlIHVzZWRcbiAgICAvLyBpbiBzeW5jaHJvbm91cyAoaWYgYXZhaWxhYmxlKS5cbiAgICBsZXQgdmFsaWRhdG9yOiBPYnNlcnZhYmxlPGFqdi5WYWxpZGF0ZUZ1bmN0aW9uPjtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fY3VycmVudENvbXBpbGF0aW9uU2NoZW1hSW5mbyA9IHNjaGVtYUluZm87XG4gICAgICB2YWxpZGF0b3IgPSBvZih0aGlzLl9hanYuY29tcGlsZShzY2hlbWEpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBQcm9wYWdhdGUgdGhlIGVycm9yLlxuICAgICAgaWYgKCEoZSBpbnN0YW5jZW9mIChhanYuTWlzc2luZ1JlZkVycm9yIGFzIHt9IGFzIEZ1bmN0aW9uKSkpIHtcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZSk7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbGlkYXRvciA9IGZyb20odGhpcy5fYWp2LmNvbXBpbGVBc3luYyhzY2hlbWEpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkYXRvclxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcCh2YWxpZGF0ZSA9PiAoZGF0YTogSnNvblZhbHVlLCBvcHRpb25zPzogU2NoZW1hVmFsaWRhdG9yT3B0aW9ucykgPT4ge1xuICAgICAgICAgIGNvbnN0IHZhbGlkYXRpb25PcHRpb25zOiBTY2hlbWFWYWxpZGF0b3JPcHRpb25zID0ge1xuICAgICAgICAgICAgd2l0aFByb21wdHM6IHRydWUsXG4gICAgICAgICAgICBhcHBseVBvc3RUcmFuc2Zvcm1zOiB0cnVlLFxuICAgICAgICAgICAgYXBwbHlQcmVUcmFuc2Zvcm1zOiB0cnVlLFxuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGNvbnN0IHZhbGlkYXRpb25Db250ZXh0ID0ge1xuICAgICAgICAgICAgcHJvbXB0RmllbGRzV2l0aFZhbHVlOiBuZXcgU2V0PHN0cmluZz4oKSxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgbGV0IHJlc3VsdCA9IG9mKGRhdGEpO1xuICAgICAgICAgIGlmICh2YWxpZGF0aW9uT3B0aW9ucy5hcHBseVByZVRyYW5zZm9ybXMpIHtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgaHR0cHM6Ly9naXRodWIuY29tL1JlYWN0aXZlWC9yeGpzL2lzc3Vlcy8zOTg5XG4gICAgICAgICAgICByZXN1bHQgPSAocmVzdWx0IGFzIGFueSkucGlwZShcbiAgICAgICAgICAgICAgLi4uWy4uLnRoaXMuX3ByZV0ubWFwKHZpc2l0b3IgPT4gY29uY2F0TWFwKChkYXRhOiBKc29uVmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2NoZW1hID09PSBmYWxzZSB8fCBzY2hlbWEgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvZihkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmlzaXRKc29uKGRhdGEsIHZpc2l0b3IsIHNjaGVtYSwgdGhpcy5fcmVzb2x2ZXIsIHZhbGlkYXRlKTtcbiAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnBpcGUoXG4gICAgICAgICAgICBzd2l0Y2hNYXAodXBkYXRlRGF0YSA9PiB0aGlzLl9hcHBseVNtYXJ0RGVmYXVsdHMoXG4gICAgICAgICAgICAgIHVwZGF0ZURhdGEsXG4gICAgICAgICAgICAgIHNjaGVtYUluZm8uc21hcnREZWZhdWx0UmVjb3JkLFxuICAgICAgICAgICAgKSksXG4gICAgICAgICAgICBzd2l0Y2hNYXAodXBkYXRlZERhdGEgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGlvbk9wdGlvbnMud2l0aFByb21wdHMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mKHVwZGF0ZWREYXRhKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IHZpc2l0b3I6IEpzb25WaXNpdG9yID0gKHZhbHVlLCBwb2ludGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb25Db250ZXh0LnByb21wdEZpZWxkc1dpdGhWYWx1ZS5hZGQocG9pbnRlcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBpZiAoc2NoZW1hID09PSBmYWxzZSB8fCBzY2hlbWEgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2YodXBkYXRlZERhdGEpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHZpc2l0SnNvbih1cGRhdGVkRGF0YSwgdmlzaXRvciwgc2NoZW1hLCB0aGlzLl9yZXNvbHZlciwgdmFsaWRhdGUpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBzd2l0Y2hNYXAodXBkYXRlZERhdGEgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGlvbk9wdGlvbnMud2l0aFByb21wdHMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mKHVwZGF0ZWREYXRhKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IGRlZmluaXRpb25zID0gc2NoZW1hSW5mby5wcm9tcHREZWZpbml0aW9uc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoZGVmID0+ICF2YWxpZGF0aW9uQ29udGV4dC5wcm9tcHRGaWVsZHNXaXRoVmFsdWUuaGFzKGRlZi5pZCkpO1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLl9wcm9tcHRQcm92aWRlciAmJiBkZWZpbml0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyb20odGhpcy5fYXBwbHlQcm9tcHRzKHVwZGF0ZWREYXRhLCBkZWZpbml0aW9ucykpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBvZih1cGRhdGVkRGF0YSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgc3dpdGNoTWFwKHVwZGF0ZWREYXRhID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdmFsaWRhdGUuY2FsbCh2YWxpZGF0aW9uQ29udGV4dCwgdXBkYXRlZERhdGEpO1xuXG4gICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgcmVzdWx0ID09ICdib29sZWFuJ1xuICAgICAgICAgICAgICAgID8gb2YoW3VwZGF0ZWREYXRhLCByZXN1bHRdKVxuICAgICAgICAgICAgICAgIDogZnJvbSgocmVzdWx0IGFzIFByb21pc2U8Ym9vbGVhbj4pXG4gICAgICAgICAgICAgICAgICAudGhlbihyID0+IFt1cGRhdGVkRGF0YSwgdHJ1ZV0pXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycjogRXJyb3IgfCBBanZWYWxpZGF0aW9uRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChlcnIgYXMgQWp2VmFsaWRhdGlvbkVycm9yKS5hanYpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZS5lcnJvcnMgPSAoZXJyIGFzIEFqdlZhbGlkYXRpb25FcnJvcikuZXJyb3JzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbdXBkYXRlZERhdGEsIGZhbHNlXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgc3dpdGNoTWFwKChbZGF0YSwgdmFsaWRdOiBbSnNvblZhbHVlLCBib29sZWFuXSkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gb2YoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsaWRhdGlvbk9wdGlvbnMuYXBwbHlQb3N0VHJhbnNmb3Jtcykge1xuICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSBodHRwczovL2dpdGh1Yi5jb20vUmVhY3RpdmVYL3J4anMvaXNzdWVzLzM5ODlcbiAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IChyZXN1bHQgYXMgYW55KS5waXBlKFxuICAgICAgICAgICAgICAgICAgICAuLi5bLi4udGhpcy5fcG9zdF0ubWFwKHZpc2l0b3IgPT4gY29uY2F0TWFwKChkYXRhOiBKc29uVmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NoZW1hID09PSBmYWxzZSB8fCBzY2hlbWEgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvZihzY2hlbWEpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2aXNpdEpzb24oZGF0YSwgdmlzaXRvciwgc2NoZW1hLCB0aGlzLl9yZXNvbHZlciwgdmFsaWRhdGUpO1xuICAgICAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQucGlwZShcbiAgICAgICAgICAgICAgICAgIG1hcChkYXRhID0+IFtkYXRhLCB2YWxpZF0pLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mKFtkYXRhLCB2YWxpZF0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG1hcCgoW2RhdGEsIHZhbGlkXTogW0pzb25WYWx1ZSwgYm9vbGVhbl0pID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YSwgc3VjY2VzczogdHJ1ZSB9IGFzIFNjaGVtYVZhbGlkYXRvclJlc3VsdDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcnM6ICh2YWxpZGF0ZS5lcnJvcnMgfHwgW10pLFxuICAgICAgICAgICAgICB9IGFzIFNjaGVtYVZhbGlkYXRvclJlc3VsdDtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgfVxuXG4gIGFkZEZvcm1hdChmb3JtYXQ6IFNjaGVtYUZvcm1hdCk6IHZvaWQge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBjb25zdCB2YWxpZGF0ZSA9IChkYXRhOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdC5mb3JtYXR0ZXIudmFsaWRhdGUoZGF0YSk7XG5cbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC50b1Byb21pc2UoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5fYWp2LmFkZEZvcm1hdChmb3JtYXQubmFtZSwge1xuICAgICAgYXN5bmM6IGZvcm1hdC5mb3JtYXR0ZXIuYXN5bmMsXG4gICAgICB2YWxpZGF0ZSxcbiAgICAvLyBBSlYgdHlwaW5ncyBsaXN0IGBjb21wYXJlYCBhcyByZXF1aXJlZCwgYnV0IGl0IGlzIG9wdGlvbmFsLlxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICB9IGFzIGFueSk7XG4gIH1cblxuICBhZGRTbWFydERlZmF1bHRQcm92aWRlcjxUPihzb3VyY2U6IHN0cmluZywgcHJvdmlkZXI6IFNtYXJ0RGVmYXVsdFByb3ZpZGVyPFQ+KSB7XG4gICAgaWYgKHRoaXMuX3NvdXJjZU1hcC5oYXMoc291cmNlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHNvdXJjZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fc291cmNlTWFwLnNldChzb3VyY2UsIHByb3ZpZGVyKTtcblxuICAgIGlmICghdGhpcy5fc21hcnREZWZhdWx0S2V5d29yZCkge1xuICAgICAgdGhpcy5fc21hcnREZWZhdWx0S2V5d29yZCA9IHRydWU7XG5cbiAgICAgIHRoaXMuX2Fqdi5hZGRLZXl3b3JkKCckZGVmYXVsdCcsIHtcbiAgICAgICAgZXJyb3JzOiBmYWxzZSxcbiAgICAgICAgdmFsaWQ6IHRydWUsXG4gICAgICAgIGNvbXBpbGU6IChzY2hlbWEsIF9wYXJlbnRTY2hlbWEsIGl0KSA9PiB7XG4gICAgICAgICAgY29uc3QgY29tcGlsYXRpb25TY2hlbUluZm8gPSB0aGlzLl9jdXJyZW50Q29tcGlsYXRpb25TY2hlbWFJbmZvO1xuICAgICAgICAgIGlmIChjb21waWxhdGlvblNjaGVtSW5mbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBXZSBjaGVhdCwgaGVhdmlseS5cbiAgICAgICAgICBjb21waWxhdGlvblNjaGVtSW5mby5zbWFydERlZmF1bHRSZWNvcmQuc2V0KFxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoKGl0IGFzIGFueSkuZGF0YVBhdGhBcnIuc2xpY2UoMSwgKGl0IGFzIGFueSkuZGF0YUxldmVsICsgMSkgYXMgc3RyaW5nW10pLFxuICAgICAgICAgICAgc2NoZW1hLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICByZXR1cm4gKCkgPT4gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgbWV0YVNjaGVtYToge1xuICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICckc291cmNlJzogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IHRydWUsXG4gICAgICAgICAgcmVxdWlyZWQ6IFsgJyRzb3VyY2UnIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZWdpc3RlclVyaUhhbmRsZXIoaGFuZGxlcjogVXJpSGFuZGxlcikge1xuICAgIHRoaXMuX3VyaUhhbmRsZXJzLmFkZChoYW5kbGVyKTtcbiAgfVxuXG4gIHVzZVByb21wdFByb3ZpZGVyKHByb3ZpZGVyOiBQcm9tcHRQcm92aWRlcikge1xuICAgIGNvbnN0IGlzU2V0dXAgPSAhIXRoaXMuX3Byb21wdFByb3ZpZGVyO1xuXG4gICAgdGhpcy5fcHJvbXB0UHJvdmlkZXIgPSBwcm92aWRlcjtcblxuICAgIGlmIChpc1NldHVwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fYWp2LmFkZEtleXdvcmQoJ3gtcHJvbXB0Jywge1xuICAgICAgZXJyb3JzOiBmYWxzZSxcbiAgICAgIHZhbGlkOiB0cnVlLFxuICAgICAgY29tcGlsZTogKHNjaGVtYSwgcGFyZW50U2NoZW1hOiBKc29uT2JqZWN0LCBpdCkgPT4ge1xuICAgICAgICBjb25zdCBjb21waWxhdGlvblNjaGVtSW5mbyA9IHRoaXMuX2N1cnJlbnRDb21waWxhdGlvblNjaGVtYUluZm87XG4gICAgICAgIGlmICghY29tcGlsYXRpb25TY2hlbUluZm8pIHtcbiAgICAgICAgICByZXR1cm4gKCkgPT4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAgICAgY29uc3QgcGF0aEFycmF5ID0gKChpdCBhcyBhbnkpLmRhdGFQYXRoQXJyIGFzIHN0cmluZ1tdKS5zbGljZSgxLCBpdC5kYXRhTGV2ZWwgKyAxKTtcbiAgICAgICAgY29uc3QgcGF0aCA9ICcvJyArIHBhdGhBcnJheS5tYXAocCA9PiBwLnJlcGxhY2UoL15cXCcvLCAnJykucmVwbGFjZSgvXFwnJC8sICcnKSkuam9pbignLycpO1xuXG4gICAgICAgIGxldCB0eXBlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBpdGVtczogQXJyYXk8c3RyaW5nIHwgeyBsYWJlbDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB9PiB8IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IG1lc3NhZ2U6IHN0cmluZztcbiAgICAgICAgaWYgKHR5cGVvZiBzY2hlbWEgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBtZXNzYWdlID0gc2NoZW1hO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lc3NhZ2UgPSBzY2hlbWEubWVzc2FnZTtcbiAgICAgICAgICB0eXBlID0gc2NoZW1hLnR5cGU7XG4gICAgICAgICAgaXRlbXMgPSBzY2hlbWEuaXRlbXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgICBpZiAocGFyZW50U2NoZW1hLnR5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgdHlwZSA9ICdjb25maXJtYXRpb24nO1xuICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShwYXJlbnRTY2hlbWEuZW51bSkpIHtcbiAgICAgICAgICAgIHR5cGUgPSAnbGlzdCc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHR5cGUgPSAnaW5wdXQnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlID09PSAnbGlzdCcgJiYgIWl0ZW1zKSB7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyZW50U2NoZW1hLmVudW0pKSB7XG4gICAgICAgICAgICB0eXBlID0gJ2xpc3QnO1xuICAgICAgICAgICAgaXRlbXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgcGFyZW50U2NoZW1hLmVudW0pIHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIC8vIEludmFsaWRcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKHsgbGFiZWw6IHZhbHVlLnRvU3RyaW5nKCksIHZhbHVlIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVmaW5pdGlvbjogUHJvbXB0RGVmaW5pdGlvbiA9IHtcbiAgICAgICAgICBpZDogcGF0aCxcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgcHJpb3JpdHk6IDAsXG4gICAgICAgICAgcmF3OiBzY2hlbWEsXG4gICAgICAgICAgaXRlbXMsXG4gICAgICAgICAgbXVsdGlzZWxlY3Q6IHR5cGUgPT09ICdsaXN0JyA/IHNjaGVtYS5tdWx0aXNlbGVjdCA6IGZhbHNlLFxuICAgICAgICAgIGRlZmF1bHQ6IHR5cGVvZiBwYXJlbnRTY2hlbWEuZGVmYXVsdCA9PSAnb2JqZWN0JyA/IHVuZGVmaW5lZCA6IHBhcmVudFNjaGVtYS5kZWZhdWx0LFxuICAgICAgICAgIGFzeW5jIHZhbGlkYXRvcihkYXRhOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGl0LnNlbGYudmFsaWRhdGUocGFyZW50U2NoZW1hLCBkYXRhKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgcmVzdWx0O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG5cbiAgICAgICAgY29tcGlsYXRpb25TY2hlbUluZm8ucHJvbXB0RGVmaW5pdGlvbnMucHVzaChkZWZpbml0aW9uKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24odGhpczogeyBwcm9tcHRGaWVsZHNXaXRoVmFsdWU6IFNldDxzdHJpbmc+IH0pIHtcbiAgICAgICAgICAvLyBJZiAndGhpcycgaXMgdW5kZWZpbmVkIGluIHRoZSBjYWxsLCB0aGVuIGl0IGRlZmF1bHRzIHRvIHRoZSBnbG9iYWxcbiAgICAgICAgICAvLyAndGhpcycuXG4gICAgICAgICAgaWYgKHRoaXMgJiYgdGhpcy5wcm9tcHRGaWVsZHNXaXRoVmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMucHJvbXB0RmllbGRzV2l0aFZhbHVlLmFkZChwYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBtZXRhU2NoZW1hOiB7XG4gICAgICAgIG9uZU9mOiBbXG4gICAgICAgICAgeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAndHlwZSc6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgJ21lc3NhZ2UnOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IHRydWUsXG4gICAgICAgICAgICByZXF1aXJlZDogWyAnbWVzc2FnZScgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5UHJvbXB0czxUPihkYXRhOiBULCBwcm9tcHRzOiBBcnJheTxQcm9tcHREZWZpbml0aW9uPik6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IHByb3ZpZGVyID0gdGhpcy5fcHJvbXB0UHJvdmlkZXI7XG4gICAgaWYgKCFwcm92aWRlcikge1xuICAgICAgcmV0dXJuIG9mKGRhdGEpO1xuICAgIH1cblxuICAgIHByb21wdHMuc29ydCgoYSwgYikgPT4gYi5wcmlvcml0eSAtIGEucHJpb3JpdHkpO1xuXG4gICAgcmV0dXJuIGZyb20ocHJvdmlkZXIocHJvbXB0cykpLnBpcGUoXG4gICAgICBtYXAoYW5zd2VycyA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgcGF0aCBpbiBhbnN3ZXJzKSB7XG4gICAgICAgICAgY29uc3QgcGF0aEZyYWdtZW50cyA9IHBhdGguc3BsaXQoJy8nKS5tYXAocGYgPT4ge1xuICAgICAgICAgICAgaWYgKC9eXFxkKyQvLnRlc3QocGYpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwZjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiAnXFwnJyArIHBmICsgJ1xcJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBDb3JlU2NoZW1hUmVnaXN0cnkuX3NldChcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBwYXRoRnJhZ21lbnRzLnNsaWNlKDEpLFxuICAgICAgICAgICAgYW5zd2Vyc1twYXRoXSBhcyB7fSxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfc2V0KFxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBkYXRhOiBhbnksXG4gICAgZnJhZ21lbnRzOiBzdHJpbmdbXSxcbiAgICB2YWx1ZToge30sXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIHBhcmVudDogYW55IHwgbnVsbCA9IG51bGwsXG4gICAgcGFyZW50UHJvcGVydHk/OiBzdHJpbmcsXG4gICAgZm9yY2U/OiBib29sZWFuLFxuICApOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZiA9IGZyYWdtZW50c1tpXTtcblxuICAgICAgaWYgKGZbMF0gPT0gJ2knKSB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZGF0YS5sZW5ndGg7IGorKykge1xuICAgICAgICAgIENvcmVTY2hlbWFSZWdpc3RyeS5fc2V0KGRhdGFbal0sIGZyYWdtZW50cy5zbGljZShpICsgMSksIHZhbHVlLCBkYXRhLCAnJyArIGopO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmIChmLnN0YXJ0c1dpdGgoJ2tleScpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhkYXRhKS5mb3JFYWNoKHByb3BlcnR5ID0+IHtcbiAgICAgICAgICBDb3JlU2NoZW1hUmVnaXN0cnkuX3NldChkYXRhW3Byb3BlcnR5XSwgZnJhZ21lbnRzLnNsaWNlKGkgKyAxKSwgdmFsdWUsIGRhdGEsIHByb3BlcnR5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmIChmLnN0YXJ0c1dpdGgoJ1xcJycpICYmIGZbZi5sZW5ndGggLSAxXSA9PSAnXFwnJykge1xuICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IGZcbiAgICAgICAgICAuc2xpY2UoMSwgLTEpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcXFwnL2csICdcXCcnKVxuICAgICAgICAgIC5yZXBsYWNlKC9cXFxcbi9nLCAnXFxuJylcbiAgICAgICAgICAucmVwbGFjZSgvXFxcXHIvZywgJ1xccicpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcXFxmL2csICdcXGYnKVxuICAgICAgICAgIC5yZXBsYWNlKC9cXFxcdC9nLCAnXFx0Jyk7XG5cbiAgICAgICAgLy8gV2Uga25vdyB3ZSBuZWVkIGFuIG9iamVjdCBiZWNhdXNlIHRoZSBmcmFnbWVudCBpcyBhIHByb3BlcnR5IGtleS5cbiAgICAgICAgaWYgKCFkYXRhICYmIHBhcmVudCAhPT0gbnVsbCAmJiBwYXJlbnRQcm9wZXJ0eSkge1xuICAgICAgICAgIGRhdGEgPSBwYXJlbnRbcGFyZW50UHJvcGVydHldID0ge307XG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50ID0gZGF0YTtcbiAgICAgICAgcGFyZW50UHJvcGVydHkgPSBwcm9wZXJ0eTtcblxuICAgICAgICBkYXRhID0gZGF0YVtwcm9wZXJ0eV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudCAmJiBwYXJlbnRQcm9wZXJ0eSAmJiAoZm9yY2UgfHwgcGFyZW50W3BhcmVudFByb3BlcnR5XSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgcGFyZW50W3BhcmVudFByb3BlcnR5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5U21hcnREZWZhdWx0czxUPihcbiAgICBkYXRhOiBULFxuICAgIHNtYXJ0RGVmYXVsdHM6IE1hcDxzdHJpbmcsIEpzb25PYmplY3Q+LFxuICApOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55IGh0dHBzOi8vZ2l0aHViLmNvbS9SZWFjdGl2ZVgvcnhqcy9pc3N1ZXMvMzk4OVxuICAgIHJldHVybiAob2YoZGF0YSkgYXMgYW55KS5waXBlKFxuICAgICAgLi4uWy4uLnNtYXJ0RGVmYXVsdHMuZW50cmllcygpXS5tYXAoKFtwb2ludGVyLCBzY2hlbWFdKSA9PiB7XG4gICAgICAgIHJldHVybiBjb25jYXRNYXA8VCwgVD4oZGF0YSA9PiB7XG4gICAgICAgICAgY29uc3QgZnJhZ21lbnRzID0gSlNPTi5wYXJzZShwb2ludGVyKTtcbiAgICAgICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLl9zb3VyY2VNYXAuZ2V0KChzY2hlbWEgYXMgSnNvbk9iamVjdCkuJHNvdXJjZSBhcyBzdHJpbmcpO1xuXG4gICAgICAgICAgbGV0IHZhbHVlID0gc291cmNlID8gc291cmNlKHNjaGVtYSkgOiBvZih1bmRlZmluZWQpO1xuXG4gICAgICAgICAgaWYgKCFpc09ic2VydmFibGUodmFsdWUpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG9mKHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gKHZhbHVlIGFzIE9ic2VydmFibGU8e30+KS5waXBlKFxuICAgICAgICAgICAgLy8gU3luY2hyb25vdXNseSBzZXQgdGhlIG5ldyBkYXRhIGF0IHRoZSBwcm9wZXIgSnNvblNjaGVtYSBwYXRoLlxuICAgICAgICAgICAgdGFwKHggPT4gQ29yZVNjaGVtYVJlZ2lzdHJ5Ll9zZXQoZGF0YSwgZnJhZ21lbnRzLCB4KSksXG4gICAgICAgICAgICAvLyBCdXQgcmV0dXJuIHRoZSBkYXRhIG9iamVjdC5cbiAgICAgICAgICAgIG1hcCgoKSA9PiBkYXRhKSxcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==