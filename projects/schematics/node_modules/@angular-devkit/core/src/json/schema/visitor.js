"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("../../utils");
const pointer_1 = require("./pointer");
function _getObjectSubSchema(schema, key) {
    if (typeof schema !== 'object' || schema === null) {
        return undefined;
    }
    // Is it an object schema?
    if (typeof schema.properties == 'object' || schema.type == 'object') {
        if (typeof schema.properties == 'object'
            && typeof schema.properties[key] == 'object') {
            return schema.properties[key];
        }
        if (typeof schema.additionalProperties == 'object') {
            return schema.additionalProperties;
        }
        return undefined;
    }
    // Is it an array schema?
    if (typeof schema.items == 'object' || schema.type == 'array') {
        return typeof schema.items == 'object' ? schema.items : undefined;
    }
    return undefined;
}
function _visitJsonRecursive(json, visitor, ptr, schema, refResolver, context, // tslint:disable-line:no-any
root) {
    if (schema && schema.hasOwnProperty('$ref') && typeof schema['$ref'] == 'string') {
        if (refResolver) {
            const resolved = refResolver(schema['$ref'], context);
            schema = resolved.schema;
            context = resolved.context;
        }
    }
    const value = visitor(json, ptr, schema, root);
    return (utils_1.isObservable(value)
        ? value
        : rxjs_1.of(value)).pipe(operators_1.concatMap((value) => {
        if (Array.isArray(value)) {
            return rxjs_1.concat(rxjs_1.from(value).pipe(operators_1.mergeMap((item, i) => {
                return _visitJsonRecursive(item, visitor, pointer_1.joinJsonPointer(ptr, '' + i), _getObjectSubSchema(schema, '' + i), refResolver, context, root || value).pipe(operators_1.tap(x => value[i] = x));
            }), operators_1.ignoreElements()), rxjs_1.of(value));
        }
        else if (typeof value == 'object' && value !== null) {
            return rxjs_1.concat(rxjs_1.from(Object.getOwnPropertyNames(value)).pipe(operators_1.mergeMap(key => {
                return _visitJsonRecursive(value[key], visitor, pointer_1.joinJsonPointer(ptr, key), _getObjectSubSchema(schema, key), refResolver, context, root || value).pipe(operators_1.tap(x => value[key] = x));
            }), operators_1.ignoreElements()), rxjs_1.of(value));
        }
        else {
            return rxjs_1.of(value);
        }
    }));
}
/**
 * Visit all the properties in a JSON object, allowing to transform them. It supports calling
 * properties synchronously or asynchronously (through Observables).
 * The original object can be mutated or replaced entirely. In case where it's replaced, the new
 * value is returned. When it's mutated though the original object will be changed.
 *
 * Please note it is possible to have an infinite loop here (which will result in a stack overflow)
 * if you return 2 objects that references each others (or the same object all the time).
 *
 * @param {JsonValue} json The Json value to visit.
 * @param {JsonVisitor} visitor A function that will be called on every items.
 * @param {JsonObject} schema A JSON schema to pass through to the visitor (where possible).
 * @param refResolver a function to resolve references in the schema.
 * @returns {Observable< | undefined>} The observable of the new root, if the root changed.
 */
function visitJson(json, visitor, schema, refResolver, context) {
    return _visitJsonRecursive(json, visitor, pointer_1.buildJsonPointer([]), schema, refResolver, context);
}
exports.visitJson = visitJson;
function visitJsonSchema(schema, visitor) {
    if (schema === false || schema === true) {
        // Nothing to visit.
        return;
    }
    const keywords = {
        additionalItems: true,
        items: true,
        contains: true,
        additionalProperties: true,
        propertyNames: true,
        not: true,
    };
    const arrayKeywords = {
        items: true,
        allOf: true,
        anyOf: true,
        oneOf: true,
    };
    const propsKeywords = {
        definitions: true,
        properties: true,
        patternProperties: true,
        additionalProperties: true,
        dependencies: true,
        items: true,
    };
    function _traverse(schema, jsonPtr, rootSchema, parentSchema, keyIndex) {
        if (schema && typeof schema == 'object' && !Array.isArray(schema)) {
            visitor(schema, jsonPtr, parentSchema, keyIndex);
            for (const key of Object.keys(schema)) {
                const sch = schema[key];
                if (key in propsKeywords) {
                    if (sch && typeof sch == 'object') {
                        for (const prop of Object.keys(sch)) {
                            _traverse(sch[prop], pointer_1.joinJsonPointer(jsonPtr, key, prop), rootSchema, schema, prop);
                        }
                    }
                }
                else if (key in keywords) {
                    _traverse(sch, pointer_1.joinJsonPointer(jsonPtr, key), rootSchema, schema, key);
                }
                else if (key in arrayKeywords) {
                    if (Array.isArray(sch)) {
                        for (let i = 0; i < sch.length; i++) {
                            _traverse(sch[i], pointer_1.joinJsonPointer(jsonPtr, key, '' + i), rootSchema, sch, '' + i);
                        }
                    }
                }
                else if (Array.isArray(sch)) {
                    for (let i = 0; i < sch.length; i++) {
                        _traverse(sch[i], pointer_1.joinJsonPointer(jsonPtr, key, '' + i), rootSchema, sch, '' + i);
                    }
                }
            }
        }
    }
    _traverse(schema, pointer_1.buildJsonPointer([]), schema);
}
exports.visitJsonSchema = visitJsonSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlzaXRvci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvanNvbi9zY2hlbWEvdmlzaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtCQUFvRTtBQUNwRSw4Q0FBMEU7QUFDMUUsdUNBQTJDO0FBRzNDLHVDQUE4RDtBQVE5RCxTQUFTLG1CQUFtQixDQUMxQixNQUE4QixFQUM5QixHQUFXO0lBRVgsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtRQUNqRCxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELDBCQUEwQjtJQUMxQixJQUFJLE9BQU8sTUFBTSxDQUFDLFVBQVUsSUFBSSxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUU7UUFDbkUsSUFBSSxPQUFPLE1BQU0sQ0FBQyxVQUFVLElBQUksUUFBUTtlQUNqQyxPQUFRLE1BQU0sQ0FBQyxVQUF5QixDQUFDLEdBQUcsQ0FBQyxJQUFJLFFBQVEsRUFBRTtZQUNoRSxPQUFRLE1BQU0sQ0FBQyxVQUF5QixDQUFDLEdBQUcsQ0FBZSxDQUFDO1NBQzdEO1FBQ0QsSUFBSSxPQUFPLE1BQU0sQ0FBQyxvQkFBb0IsSUFBSSxRQUFRLEVBQUU7WUFDbEQsT0FBTyxNQUFNLENBQUMsb0JBQWtDLENBQUM7U0FDbEQ7UUFFRCxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELHlCQUF5QjtJQUN6QixJQUFJLE9BQU8sTUFBTSxDQUFDLEtBQUssSUFBSSxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxPQUFPLEVBQUU7UUFDN0QsT0FBTyxPQUFPLE1BQU0sQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBRSxNQUFNLENBQUMsS0FBb0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0tBQ25GO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFD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Q0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDbkMsU0FBUyxDQUNQLEdBQUcsQ0FBQyxDQUFDLENBQWMsRUFDbkIseUJBQWUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFDckMsVUFBVSxFQUNWLEdBQUcsRUFDSCxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUM7cUJBQ0g7aUJBQ0Y7YUFDRjtTQUNGO0lBQ0gsQ0FBQztJQUVELFNBQVMsQ0FBQyxNQUFNLEVBQUUsMEJBQWdCLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQXJGRCwwQ0FxRkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBjb25jYXQsIGZyb20sIG9mIGFzIG9ic2VydmFibGVPZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY29uY2F0TWFwLCBpZ25vcmVFbGVtZW50cywgbWVyZ2VNYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGlzT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IEpzb25BcnJheSwgSnNvbk9iamVjdCwgSnNvblZhbHVlIH0gZnJvbSAnLi4vaW50ZXJmYWNlJztcbmltcG9ydCB7IEpzb25Qb2ludGVyLCBKc29uU2NoZW1hVmlzaXRvciwgSnNvblZpc2l0b3IgfSBmcm9tICcuL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBidWlsZEpzb25Qb2ludGVyLCBqb2luSnNvblBvaW50ZXIgfSBmcm9tICcuL3BvaW50ZXInO1xuaW1wb3J0IHsgSnNvblNjaGVtYSB9IGZyb20gJy4vc2NoZW1hJztcblxuXG5leHBvcnQgaW50ZXJmYWNlIFJlZmVyZW5jZVJlc29sdmVyPENvbnRleHRUPiB7XG4gIChyZWY6IHN0cmluZywgY29udGV4dD86IENvbnRleHRUKTogeyBjb250ZXh0PzogQ29udGV4dFQsIHNjaGVtYT86IEpzb25PYmplY3QgfTtcbn1cblxuZnVuY3Rpb24gX2dldE9iamVjdFN1YlNjaGVtYShcbiAgc2NoZW1hOiBKc29uT2JqZWN0IHwgdW5kZWZpbmVkLFxuICBrZXk6IHN0cmluZyxcbik6IEpzb25PYmplY3QgfCB1bmRlZmluZWQge1xuICBpZiAodHlwZW9mIHNjaGVtYSAhPT0gJ29iamVjdCcgfHwgc2NoZW1hID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIElzIGl0IGFuIG9iamVjdCBzY2hlbWE/XG4gIGlmICh0eXBlb2Ygc2NoZW1hLnByb3BlcnRpZXMgPT0gJ29iamVjdCcgfHwgc2NoZW1hLnR5cGUgPT0gJ29iamVjdCcpIHtcbiAgICBpZiAodHlwZW9mIHNjaGVtYS5wcm9wZXJ0aWVzID09ICdvYmplY3QnXG4gICAgICAgICYmIHR5cGVvZiAoc2NoZW1hLnByb3BlcnRpZXMgYXMgSnNvbk9iamVjdClba2V5XSA9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIChzY2hlbWEucHJvcGVydGllcyBhcyBKc29uT2JqZWN0KVtrZXldIGFzIEpzb25PYmplY3Q7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzID09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gc2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzIGFzIEpzb25PYmplY3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIElzIGl0IGFuIGFycmF5IHNjaGVtYT9cbiAgaWYgKHR5cGVvZiBzY2hlbWEuaXRlbXMgPT0gJ29iamVjdCcgfHwgc2NoZW1hLnR5cGUgPT0gJ2FycmF5Jykge1xuICAgIHJldHVybiB0eXBlb2Ygc2NoZW1hLml0ZW1zID09ICdvYmplY3QnID8gKHNjaGVtYS5pdGVtcyBhcyBKc29uT2JqZWN0KSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIF92aXNpdEpzb25SZWN1cnNpdmU8Q29udGV4dFQ+KFxuICBqc29uOiBKc29uVmFsdWUsXG4gIHZpc2l0b3I6IEpzb25WaXNpdG9yLFxuICBwdHI6IEpzb25Qb2ludGVyLFxuICBzY2hlbWE/OiBKc29uT2JqZWN0LFxuICByZWZSZXNvbHZlcj86IFJlZmVyZW5jZVJlc29sdmVyPENvbnRleHRUPixcbiAgY29udGV4dD86IENvbnRleHRULCAgLy8gdHNsaW50OmRpc2FibGUtbGluZTpuby1hbnlcbiAgcm9vdD86IEpzb25PYmplY3QgfCBKc29uQXJyYXksXG4pOiBPYnNlcnZhYmxlPEpzb25WYWx1ZT4ge1xuICBpZiAoc2NoZW1hICYmIHNjaGVtYS5oYXNPd25Qcm9wZXJ0eSgnJHJlZicpICYmIHR5cGVvZiBzY2hlbWFbJyRyZWYnXSA9PSAnc3RyaW5nJykge1xuICAgIGlmIChyZWZSZXNvbHZlcikge1xuICAgICAgY29uc3QgcmVzb2x2ZWQgPSByZWZSZXNvbHZlcihzY2hlbWFbJyRyZWYnXSBhcyBzdHJpbmcsIGNvbnRleHQpO1xuICAgICAgc2NoZW1hID0gcmVzb2x2ZWQuc2NoZW1hO1xuICAgICAgY29udGV4dCA9IHJlc29sdmVkLmNvbnRleHQ7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgdmFsdWUgPSB2aXNpdG9yKGpzb24sIHB0ciwgc2NoZW1hLCByb290KTtcblxuICByZXR1cm4gKGlzT2JzZXJ2YWJsZSh2YWx1ZSlcbiAgICAgID8gdmFsdWUgYXMgT2JzZXJ2YWJsZTxKc29uVmFsdWU+XG4gICAgICA6IG9ic2VydmFibGVPZih2YWx1ZSBhcyBKc29uVmFsdWUpXG4gICkucGlwZShcbiAgICBjb25jYXRNYXAoKHZhbHVlOiBKc29uVmFsdWUpID0+IHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gY29uY2F0KFxuICAgICAgICAgIGZyb20odmFsdWUpLnBpcGUoXG4gICAgICAgICAgICBtZXJnZU1hcCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gX3Zpc2l0SnNvblJlY3Vyc2l2ZShcbiAgICAgICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgICAgIHZpc2l0b3IsXG4gICAgICAgICAgICAgICAgam9pbkpzb25Qb2ludGVyKHB0ciwgJycgKyBpKSxcbiAgICAgICAgICAgICAgICBfZ2V0T2JqZWN0U3ViU2NoZW1hKHNjaGVtYSwgJycgKyBpKSxcbiAgICAgICAgICAgICAgICByZWZSZXNvbHZlcixcbiAgICAgICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgICAgIHJvb3QgfHwgdmFsdWUsXG4gICAgICAgICAgICAgICkucGlwZSh0YXA8SnNvblZhbHVlPih4ID0+IHZhbHVlW2ldID0geCkpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBpZ25vcmVFbGVtZW50cygpLFxuICAgICAgICAgICksXG4gICAgICAgICAgb2JzZXJ2YWJsZU9mPEpzb25WYWx1ZT4odmFsdWUpLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGNvbmNhdChcbiAgICAgICAgICBmcm9tKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKSkucGlwZShcbiAgICAgICAgICAgIG1lcmdlTWFwKGtleSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBfdmlzaXRKc29uUmVjdXJzaXZlKFxuICAgICAgICAgICAgICAgIHZhbHVlW2tleV0sXG4gICAgICAgICAgICAgICAgdmlzaXRvcixcbiAgICAgICAgICAgICAgICBqb2luSnNvblBvaW50ZXIocHRyLCBrZXkpLFxuICAgICAgICAgICAgICAgIF9nZXRPYmplY3RTdWJTY2hlbWEoc2NoZW1hLCBrZXkpLFxuICAgICAgICAgICAgICAgIHJlZlJlc29sdmVyLFxuICAgICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICAgICAgcm9vdCB8fCB2YWx1ZSxcbiAgICAgICAgICAgICAgKS5waXBlKHRhcDxKc29uVmFsdWU+KHggPT4gdmFsdWVba2V5XSA9IHgpKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgaWdub3JlRWxlbWVudHMoKSxcbiAgICAgICAgICAgKSxcbiAgICAgICAgICAgb2JzZXJ2YWJsZU9mKHZhbHVlKSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YodmFsdWUpO1xuICAgICAgfVxuICAgIH0pLFxuICApO1xufVxuXG4vKipcbiAqIFZpc2l0IGFsbCB0aGUgcHJvcGVydGllcyBpbiBhIEpTT04gb2JqZWN0LCBhbGxvd2luZyB0byB0cmFuc2Zvcm0gdGhlbS4gSXQgc3VwcG9ydHMgY2FsbGluZ1xuICogcHJvcGVydGllcyBzeW5jaHJvbm91c2x5IG9yIGFzeW5jaHJvbm91c2x5ICh0aHJvdWdoIE9ic2VydmFibGVzKS5cbiAqIFRoZSBvcmlnaW5hbCBvYmplY3QgY2FuIGJlIG11dGF0ZWQgb3IgcmVwbGFjZWQgZW50aXJlbHkuIEluIGNhc2Ugd2hlcmUgaXQncyByZXBsYWNlZCwgdGhlIG5ld1xuICogdmFsdWUgaXMgcmV0dXJuZWQuIFdoZW4gaXQncyBtdXRhdGVkIHRob3VnaCB0aGUgb3JpZ2luYWwgb2JqZWN0IHdpbGwgYmUgY2hhbmdlZC5cbiAqXG4gKiBQbGVhc2Ugbm90ZSBpdCBpcyBwb3NzaWJsZSB0byBoYXZlIGFuIGluZmluaXRlIGxvb3AgaGVyZSAod2hpY2ggd2lsbCByZXN1bHQgaW4gYSBzdGFjayBvdmVyZmxvdylcbiAqIGlmIHlvdSByZXR1cm4gMiBvYmplY3RzIHRoYXQgcmVmZXJlbmNlcyBlYWNoIG90aGVycyAob3IgdGhlIHNhbWUgb2JqZWN0IGFsbCB0aGUgdGltZSkuXG4gKlxuICogQHBhcmFtIHtKc29uVmFsdWV9IGpzb24gVGhlIEpzb24gdmFsdWUgdG8gdmlzaXQuXG4gKiBAcGFyYW0ge0pzb25WaXNpdG9yfSB2aXNpdG9yIEEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCBvbiBldmVyeSBpdGVtcy5cbiAqIEBwYXJhbSB7SnNvbk9iamVjdH0gc2NoZW1hIEEgSlNPTiBzY2hlbWEgdG8gcGFzcyB0aHJvdWdoIHRvIHRoZSB2aXNpdG9yICh3aGVyZSBwb3NzaWJsZSkuXG4gKiBAcGFyYW0gcmVmUmVzb2x2ZXIgYSBmdW5jdGlvbiB0byByZXNvbHZlIHJlZmVyZW5jZXMgaW4gdGhlIHNjaGVtYS5cbiAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPCB8IHVuZGVmaW5lZD59IFRoZSBvYnNlcnZhYmxlIG9mIHRoZSBuZXcgcm9vdCwgaWYgdGhlIHJvb3QgY2hhbmdlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZpc2l0SnNvbjxDb250ZXh0VD4oXG4gIGpzb246IEpzb25WYWx1ZSxcbiAgdmlzaXRvcjogSnNvblZpc2l0b3IsXG4gIHNjaGVtYT86IEpzb25PYmplY3QsXG4gIHJlZlJlc29sdmVyPzogUmVmZXJlbmNlUmVzb2x2ZXI8Q29udGV4dFQ+LFxuICBjb250ZXh0PzogQ29udGV4dFQsICAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWFueVxuKTogT2JzZXJ2YWJsZTxKc29uVmFsdWU+IHtcbiAgcmV0dXJuIF92aXNpdEpzb25SZWN1cnNpdmUoanNvbiwgdmlzaXRvciwgYnVpbGRKc29uUG9pbnRlcihbXSksIHNjaGVtYSwgcmVmUmVzb2x2ZXIsIGNvbnRleHQpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiB2aXNpdEpzb25TY2hlbWEoc2NoZW1hOiBKc29uU2NoZW1hLCB2aXNpdG9yOiBKc29uU2NoZW1hVmlzaXRvcikge1xuICBpZiAoc2NoZW1hID09PSBmYWxzZSB8fCBzY2hlbWEgPT09IHRydWUpIHtcbiAgICAvLyBOb3RoaW5nIHRvIHZpc2l0LlxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGtleXdvcmRzID0ge1xuICAgIGFkZGl0aW9uYWxJdGVtczogdHJ1ZSxcbiAgICBpdGVtczogdHJ1ZSxcbiAgICBjb250YWluczogdHJ1ZSxcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllczogdHJ1ZSxcbiAgICBwcm9wZXJ0eU5hbWVzOiB0cnVlLFxuICAgIG5vdDogdHJ1ZSxcbiAgfTtcblxuICBjb25zdCBhcnJheUtleXdvcmRzID0ge1xuICAgIGl0ZW1zOiB0cnVlLFxuICAgIGFsbE9mOiB0cnVlLFxuICAgIGFueU9mOiB0cnVlLFxuICAgIG9uZU9mOiB0cnVlLFxuICB9O1xuXG4gIGNvbnN0IHByb3BzS2V5d29yZHMgPSB7XG4gICAgZGVmaW5pdGlvbnM6IHRydWUsXG4gICAgcHJvcGVydGllczogdHJ1ZSxcbiAgICBwYXR0ZXJuUHJvcGVydGllczogdHJ1ZSxcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllczogdHJ1ZSxcbiAgICBkZXBlbmRlbmNpZXM6IHRydWUsXG4gICAgaXRlbXM6IHRydWUsXG4gIH07XG5cbiAgZnVuY3Rpb24gX3RyYXZlcnNlKFxuICAgIHNjaGVtYTogSnNvbk9iamVjdCB8IEpzb25BcnJheSxcbiAgICBqc29uUHRyOiBKc29uUG9pbnRlcixcbiAgICByb290U2NoZW1hOiBKc29uT2JqZWN0LFxuICAgIHBhcmVudFNjaGVtYT86IEpzb25PYmplY3QgfCBKc29uQXJyYXksXG4gICAga2V5SW5kZXg/OiBzdHJpbmcsXG4gICkge1xuICAgIGlmIChzY2hlbWEgJiYgdHlwZW9mIHNjaGVtYSA9PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShzY2hlbWEpKSB7XG4gICAgICB2aXNpdG9yKHNjaGVtYSwganNvblB0ciwgcGFyZW50U2NoZW1hLCBrZXlJbmRleCk7XG5cbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNjaGVtYSkpIHtcbiAgICAgICAgY29uc3Qgc2NoID0gc2NoZW1hW2tleV07XG4gICAgICAgIGlmIChrZXkgaW4gcHJvcHNLZXl3b3Jkcykge1xuICAgICAgICAgIGlmIChzY2ggJiYgdHlwZW9mIHNjaCA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwcm9wIG9mIE9iamVjdC5rZXlzKHNjaCkpIHtcbiAgICAgICAgICAgICAgX3RyYXZlcnNlKFxuICAgICAgICAgICAgICAgIChzY2ggYXMgSnNvbk9iamVjdClbcHJvcF0gYXMgSnNvbk9iamVjdCxcbiAgICAgICAgICAgICAgICBqb2luSnNvblBvaW50ZXIoanNvblB0ciwga2V5LCBwcm9wKSxcbiAgICAgICAgICAgICAgICByb290U2NoZW1hLFxuICAgICAgICAgICAgICAgIHNjaGVtYSxcbiAgICAgICAgICAgICAgICBwcm9wLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChrZXkgaW4ga2V5d29yZHMpIHtcbiAgICAgICAgICBfdHJhdmVyc2Uoc2NoIGFzIEpzb25PYmplY3QsIGpvaW5Kc29uUG9pbnRlcihqc29uUHRyLCBrZXkpLCByb290U2NoZW1hLCBzY2hlbWEsIGtleSk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5IGluIGFycmF5S2V5d29yZHMpIHtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzY2gpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjaC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBfdHJhdmVyc2UoXG4gICAgICAgICAgICAgICAgc2NoW2ldIGFzIEpzb25BcnJheSxcbiAgICAgICAgICAgICAgICBqb2luSnNvblBvaW50ZXIoanNvblB0ciwga2V5LCAnJyArIGkpLFxuICAgICAgICAgICAgICAgIHJvb3RTY2hlbWEsXG4gICAgICAgICAgICAgICAgc2NoLFxuICAgICAgICAgICAgICAgICcnICsgaSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShzY2gpKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY2gubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIF90cmF2ZXJzZShcbiAgICAgICAgICAgICAgc2NoW2ldIGFzIEpzb25BcnJheSxcbiAgICAgICAgICAgICAgam9pbkpzb25Qb2ludGVyKGpzb25QdHIsIGtleSwgJycgKyBpKSxcbiAgICAgICAgICAgICAgcm9vdFNjaGVtYSxcbiAgICAgICAgICAgICAgc2NoLFxuICAgICAgICAgICAgICAnJyArIGksXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF90cmF2ZXJzZShzY2hlbWEsIGJ1aWxkSnNvblBvaW50ZXIoW10pLCBzY2hlbWEpO1xufVxuIl19