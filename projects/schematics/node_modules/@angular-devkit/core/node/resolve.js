"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const fs = require("fs");
const path = require("path");
const src_1 = require("../src");
const fs_1 = require("./fs");
/**
 * Exception thrown when a module could not be resolved.
 */
class ModuleNotFoundException extends src_1.BaseException {
    constructor(moduleName, basePath) {
        super(`Could not find module ${JSON.stringify(moduleName)} from ${JSON.stringify(basePath)}.`);
        this.moduleName = moduleName;
        this.basePath = basePath;
        this.code = 'MODULE_NOT_FOUND';
    }
}
exports.ModuleNotFoundException = ModuleNotFoundException;
/**
 * Returns a list of all the callers from the resolve() call.
 * @returns {string[]}
 * @private
 */
function _caller() {
    // see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    const error = Error;
    const origPrepareStackTrace = error.prepareStackTrace;
    error.prepareStackTrace = (_, stack) => stack;
    const stack = (new Error()).stack;
    error.prepareStackTrace = origPrepareStackTrace;
    return stack ? stack.map(x => x.getFileName()).filter(x => !!x) : [];
}
/**
 * Get the global directory for node_modules. This is based on NPM code itself, and may be subject
 * to change, but is relatively stable.
 * @returns {string} The path to node_modules itself.
 * @private
 */
function _getGlobalNodeModules() {
    let globalPrefix;
    if (process.env.PREFIX) {
        globalPrefix = process.env.PREFIX;
    }
    else if (process.platform === 'win32') {
        // c:\node\node.exe --> prefix=c:\node\
        globalPrefix = path.dirname(process.execPath);
    }
    else {
        // /usr/local/bin/node --> prefix=/usr/local
        globalPrefix = path.dirname(path.dirname(process.execPath));
        // destdir only is respected on Unix
        const destdir = process.env.DESTDIR;
        if (destdir) {
            globalPrefix = path.join(destdir, globalPrefix);
        }
    }
    return (process.platform !== 'win32')
        ? path.resolve(globalPrefix || '', 'lib', 'node_modules')
        : path.resolve(globalPrefix || '', 'node_modules');
}
let _resolveHook = null;
function setResolveHook(hook) {
    _resolveHook = hook;
}
exports.setResolveHook = setResolveHook;
/**
 * Resolve a package using a logic similar to npm require.resolve, but with more options.
 * @param x The package name to resolve.
 * @param options A list of options. See documentation of those options.
 * @returns {string} Path to the index to include, or if `resolvePackageJson` option was
 *                   passed, a path to that file.
 * @throws {ModuleNotFoundException} If no module with that name was found anywhere.
 */
function resolve(x, options) {
    if (_resolveHook) {
        const maybe = _resolveHook(x, options);
        if (maybe) {
            return maybe;
        }
    }
    const readFileSync = fs.readFileSync;
    const extensions = options.extensions || Object.keys(require.extensions);
    const basePath = options.basedir;
    options.paths = options.paths || [];
    if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
        let res = path.resolve(basePath, x);
        if (x === '..' || x.slice(-1) === '/') {
            res += '/';
        }
        const m = loadAsFileSync(res) || loadAsDirectorySync(res);
        if (m) {
            return m;
        }
    }
    else {
        const n = loadNodeModulesSync(x, basePath);
        if (n) {
            return n;
        }
    }
    // Fallback to checking the local (callee) node modules.
    if (options.checkLocal) {
        const callers = _caller();
        for (const caller of callers) {
            const localDir = path.dirname(caller);
            if (localDir !== options.basedir) {
                try {
                    return resolve(x, Object.assign({}, options, { checkLocal: false, checkGlobal: false, basedir: localDir }));
                }
                catch (e) {
                    // Just swap the basePath with the original call one.
                    if (!(e instanceof ModuleNotFoundException)) {
                        throw e;
                    }
                }
            }
        }
    }
    // Fallback to checking the global node modules.
    if (options.checkGlobal) {
        const globalDir = path.dirname(_getGlobalNodeModules());
        if (globalDir !== options.basedir) {
            try {
                return resolve(x, Object.assign({}, options, { checkLocal: false, checkGlobal: false, basedir: globalDir }));
            }
            catch (e) {
                // Just swap the basePath with the original call one.
                if (!(e instanceof ModuleNotFoundException)) {
                    throw e;
                }
            }
        }
    }
    throw new ModuleNotFoundException(x, basePath);
    function loadAsFileSync(x) {
        if (fs_1.isFile(x)) {
            return x;
        }
        return extensions.map(ex => x + ex).find(f => fs_1.isFile(f)) || null;
    }
    function loadAsDirectorySync(x) {
        const pkgfile = path.join(x, 'package.json');
        if (fs_1.isFile(pkgfile)) {
            if (options.resolvePackageJson) {
                return pkgfile;
            }
            try {
                const body = readFileSync(pkgfile, 'UTF8');
                const pkg = JSON.parse(body);
                if (pkg['main']) {
                    if (pkg['main'] === '.' || pkg['main'] === './') {
                        pkg['main'] = 'index';
                    }
                    const m = loadAsFileSync(path.resolve(x, pkg['main']));
                    if (m) {
                        return m;
                    }
                    const n = loadAsDirectorySync(path.resolve(x, pkg['main']));
                    if (n) {
                        return n;
                    }
                }
            }
            catch (_a) { }
        }
        return loadAsFileSync(path.join(x, '/index'));
    }
    function loadNodeModulesSync(x, start) {
        const dirs = nodeModulesPaths(start, options);
        for (const dir of dirs) {
            const m = loadAsFileSync(path.join(dir, '/', x));
            if (m) {
                return m;
            }
            const n = loadAsDirectorySync(path.join(dir, '/', x));
            if (n) {
                return n;
            }
        }
        return null;
    }
    function nodeModulesPaths(start, opts) {
        const modules = ['node_modules'];
        // ensure that `start` is an absolute path at this point,
        // resolving against the process' current working directory
        let absoluteStart = path.resolve(start);
        if (opts && opts.preserveSymlinks === false) {
            try {
                absoluteStart = fs.realpathSync(absoluteStart);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err;
                }
            }
        }
        let prefix = '/';
        if (/^([A-Za-z]:)/.test(absoluteStart)) {
            prefix = '';
        }
        else if (/^\\\\/.test(absoluteStart)) {
            prefix = '\\\\';
        }
        const paths = [absoluteStart];
        let parsed = path.parse(absoluteStart);
        while (parsed.dir !== paths[paths.length - 1]) {
            paths.push(parsed.dir);
            parsed = path.parse(parsed.dir);
        }
        const dirs = paths.reduce((dirs, aPath) => {
            return dirs.concat(modules.map(function (moduleDir) {
                return path.join(prefix, aPath, moduleDir);
            }));
        }, []);
        return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
    }
}
exports.resolve = resolve;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9ub2RlL3Jlc29sdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLGdDQUF1QztBQUN2Qyw2QkFBOEI7QUFFOUI7O0dBRUc7QUFDSCxNQUFhLHVCQUF3QixTQUFRLG1CQUFhO0lBR3hELFlBQTRCLFVBQWtCLEVBQWtCLFFBQWdCO1FBQzlFLEtBQUssQ0FBQyx5QkFBeUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQURyRSxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQWtCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFFOUUsSUFBSSxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQztJQUNqQyxDQUFDO0NBQ0Y7QUFQRCwwREFPQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLE9BQU87SUFDZCxnRUFBZ0U7SUFDaEUsTUFBTSxLQUFLLEdBQUcsS0FBOEQsQ0FBQztJQUM3RSxNQUFNLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztJQUN0RCxLQUFLLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDOUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBa0UsQ0FBQztJQUMvRixLQUFLLENBQUMsaUJBQWlCLEdBQUcscUJBQXFCLENBQUM7SUFFaEQsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxD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QUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzdELENBQUM7QUFDSCxDQUFDO0FBM0tELDBCQTJLQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBCYXNlRXhjZXB0aW9uIH0gZnJvbSAnLi4vc3JjJztcbmltcG9ydCB7IGlzRmlsZSB9IGZyb20gJy4vZnMnO1xuXG4vKipcbiAqIEV4Y2VwdGlvbiB0aHJvd24gd2hlbiBhIG1vZHVsZSBjb3VsZCBub3QgYmUgcmVzb2x2ZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBNb2R1bGVOb3RGb3VuZEV4Y2VwdGlvbiBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICBwdWJsaWMgcmVhZG9ubHkgY29kZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBtb2R1bGVOYW1lOiBzdHJpbmcsIHB1YmxpYyByZWFkb25seSBiYXNlUGF0aDogc3RyaW5nKSB7XG4gICAgc3VwZXIoYENvdWxkIG5vdCBmaW5kIG1vZHVsZSAke0pTT04uc3RyaW5naWZ5KG1vZHVsZU5hbWUpfSBmcm9tICR7SlNPTi5zdHJpbmdpZnkoYmFzZVBhdGgpfS5gKTtcbiAgICB0aGlzLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgbGlzdCBvZiBhbGwgdGhlIGNhbGxlcnMgZnJvbSB0aGUgcmVzb2x2ZSgpIGNhbGwuXG4gKiBAcmV0dXJucyB7c3RyaW5nW119XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfY2FsbGVyKCk6IHN0cmluZ1tdIHtcbiAgLy8gc2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3Avdjgvd2lraS9KYXZhU2NyaXB0U3RhY2tUcmFjZUFwaVxuICBjb25zdCBlcnJvciA9IEVycm9yIGFzIHt9IGFzIHsgcHJlcGFyZVN0YWNrVHJhY2U6ICh4OiB7fSwgc3RhY2s6IHt9KSA9PiB7fSB9O1xuICBjb25zdCBvcmlnUHJlcGFyZVN0YWNrVHJhY2UgPSBlcnJvci5wcmVwYXJlU3RhY2tUcmFjZTtcbiAgZXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSAoXywgc3RhY2spID0+IHN0YWNrO1xuICBjb25zdCBzdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2sgYXMge30gfCB1bmRlZmluZWQgYXMgeyBnZXRGaWxlTmFtZSgpOiBzdHJpbmcgfVtdIHwgdW5kZWZpbmVkO1xuICBlcnJvci5wcmVwYXJlU3RhY2tUcmFjZSA9IG9yaWdQcmVwYXJlU3RhY2tUcmFjZTtcblxuICByZXR1cm4gc3RhY2sgPyBzdGFjay5tYXAoeCA9PiB4LmdldEZpbGVOYW1lKCkpLmZpbHRlcih4ID0+ICEheCkgOiBbXTtcbn1cblxuXG4vKipcbiAqIEdldCB0aGUgZ2xvYmFsIGRpcmVjdG9yeSBmb3Igbm9kZV9tb2R1bGVzLiBUaGlzIGlzIGJhc2VkIG9uIE5QTSBjb2RlIGl0c2VsZiwgYW5kIG1heSBiZSBzdWJqZWN0XG4gKiB0byBjaGFuZ2UsIGJ1dCBpcyByZWxhdGl2ZWx5IHN0YWJsZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBwYXRoIHRvIG5vZGVfbW9kdWxlcyBpdHNlbGYuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfZ2V0R2xvYmFsTm9kZU1vZHVsZXMoKSB7XG4gIGxldCBnbG9iYWxQcmVmaXg7XG5cbiAgaWYgKHByb2Nlc3MuZW52LlBSRUZJWCkge1xuICAgIGdsb2JhbFByZWZpeCA9IHByb2Nlc3MuZW52LlBSRUZJWDtcbiAgfSBlbHNlIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgLy8gYzpcXG5vZGVcXG5vZGUuZXhlIC0tPiBwcmVmaXg9YzpcXG5vZGVcXFxuICAgIGdsb2JhbFByZWZpeCA9IHBhdGguZGlybmFtZShwcm9jZXNzLmV4ZWNQYXRoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyAvdXNyL2xvY2FsL2Jpbi9ub2RlIC0tPiBwcmVmaXg9L3Vzci9sb2NhbFxuICAgIGdsb2JhbFByZWZpeCA9IHBhdGguZGlybmFtZShwYXRoLmRpcm5hbWUocHJvY2Vzcy5leGVjUGF0aCkpO1xuXG4gICAgLy8gZGVzdGRpciBvbmx5IGlzIHJlc3BlY3RlZCBvbiBVbml4XG4gICAgY29uc3QgZGVzdGRpciA9IHByb2Nlc3MuZW52LkRFU1RESVI7XG4gICAgaWYgKGRlc3RkaXIpIHtcbiAgICAgIGdsb2JhbFByZWZpeCA9IHBhdGguam9pbihkZXN0ZGlyLCBnbG9iYWxQcmVmaXgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ3dpbjMyJylcbiAgICA/IHBhdGgucmVzb2x2ZShnbG9iYWxQcmVmaXggfHwgJycsICdsaWInLCAnbm9kZV9tb2R1bGVzJylcbiAgICA6IHBhdGgucmVzb2x2ZShnbG9iYWxQcmVmaXggfHwgJycsICdub2RlX21vZHVsZXMnKTtcbn1cblxuXG5leHBvcnQgaW50ZXJmYWNlIFJlc29sdmVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBiYXNlZGlyIHRvIHVzZSBmcm9tIHdoaWNoIHRvIHJlc29sdmUuXG4gICAqL1xuICBiYXNlZGlyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGV4dGVuc2lvbnMgdG8gcmVzb2x2ZS4gQnkgZGVmYXVsdCB1c2VzIE9iamVjdC5rZXlzKHJlcXVpcmUuZXh0ZW5zaW9ucykuXG4gICAqL1xuICBleHRlbnNpb25zPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEFuIGFkZGl0aW9uYWwgbGlzdCBvZiBwYXRocyB0byBsb29rIGludG8uXG4gICAqL1xuICBwYXRocz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0byBwcmVzZXJ2ZSBzeW1ib2xpYyBsaW5rcy4gSWYgZmFsc2UsIHRoZSBhY3R1YWwgcGF0aHMgcG9pbnRlZCBieVxuICAgKiB0aGUgc3ltYm9saWMgbGlua3Mgd2lsbCBiZSB1c2VkLiBUaGlzIGRlZmF1bHRzIHRvIHRydWUuXG4gICAqL1xuICBwcmVzZXJ2ZVN5bWxpbmtzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBmYWxsYmFjayB0byBhIGdsb2JhbCBsb29rdXAgaWYgdGhlIGJhc2VkaXIgb25lIGZhaWxlZC5cbiAgICovXG4gIGNoZWNrR2xvYmFsPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBmYWxsYmFjayB0byB1c2luZyB0aGUgbG9jYWwgY2FsbGVyJ3MgZGlyZWN0b3J5IGlmIHRoZSBiYXNlZGlyIGZhaWxlZC5cbiAgICovXG4gIGNoZWNrTG9jYWw/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIG9ubHkgcmVzb2x2ZSBhbmQgcmV0dXJuIHRoZSBmaXJzdCBwYWNrYWdlLmpzb24gZmlsZSBmb3VuZC4gQnkgZGVmYXVsdCxcbiAgICogcmVzb2x2ZXMgdGhlIG1haW4gZmllbGQgb3IgdGhlIGluZGV4IG9mIHRoZSBwYWNrYWdlLlxuICAgKi9cbiAgcmVzb2x2ZVBhY2thZ2VKc29uPzogYm9vbGVhbjtcbn1cblxuXG5sZXQgX3Jlc29sdmVIb29rOiAoKHg6IHN0cmluZywgb3B0aW9uczogUmVzb2x2ZU9wdGlvbnMpID0+IHN0cmluZyB8IG51bGwpIHwgbnVsbCA9IG51bGw7XG5leHBvcnQgZnVuY3Rpb24gc2V0UmVzb2x2ZUhvb2soXG4gIGhvb2s6ICgoeDogc3RyaW5nLCBvcHRpb25zOiBSZXNvbHZlT3B0aW9ucykgPT4gc3RyaW5nIHwgbnVsbCkgfCBudWxsLFxuKSB7XG4gIF9yZXNvbHZlSG9vayA9IGhvb2s7XG59XG5cblxuLyoqXG4gKiBSZXNvbHZlIGEgcGFja2FnZSB1c2luZyBhIGxvZ2ljIHNpbWlsYXIgdG8gbnBtIHJlcXVpcmUucmVzb2x2ZSwgYnV0IHdpdGggbW9yZSBvcHRpb25zLlxuICogQHBhcmFtIHggVGhlIHBhY2thZ2UgbmFtZSB0byByZXNvbHZlLlxuICogQHBhcmFtIG9wdGlvbnMgQSBsaXN0IG9mIG9wdGlvbnMuIFNlZSBkb2N1bWVudGF0aW9uIG9mIHRob3NlIG9wdGlvbnMuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBQYXRoIHRvIHRoZSBpbmRleCB0byBpbmNsdWRlLCBvciBpZiBgcmVzb2x2ZVBhY2thZ2VKc29uYCBvcHRpb24gd2FzXG4gKiAgICAgICAgICAgICAgICAgICBwYXNzZWQsIGEgcGF0aCB0byB0aGF0IGZpbGUuXG4gKiBAdGhyb3dzIHtNb2R1bGVOb3RGb3VuZEV4Y2VwdGlvbn0gSWYgbm8gbW9kdWxlIHdpdGggdGhhdCBuYW1lIHdhcyBmb3VuZCBhbnl3aGVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmUoeDogc3RyaW5nLCBvcHRpb25zOiBSZXNvbHZlT3B0aW9ucyk6IHN0cmluZyB7XG4gIGlmIChfcmVzb2x2ZUhvb2spIHtcbiAgICBjb25zdCBtYXliZSA9IF9yZXNvbHZlSG9vayh4LCBvcHRpb25zKTtcbiAgICBpZiAobWF5YmUpIHtcbiAgICAgIHJldHVybiBtYXliZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZWFkRmlsZVN5bmMgPSBmcy5yZWFkRmlsZVN5bmM7XG5cbiAgY29uc3QgZXh0ZW5zaW9uczogc3RyaW5nW10gPSBvcHRpb25zLmV4dGVuc2lvbnMgfHwgT2JqZWN0LmtleXMocmVxdWlyZS5leHRlbnNpb25zKTtcbiAgY29uc3QgYmFzZVBhdGggPSBvcHRpb25zLmJhc2VkaXI7XG5cbiAgb3B0aW9ucy5wYXRocyA9IG9wdGlvbnMucGF0aHMgfHwgW107XG5cbiAgaWYgKC9eKD86XFwuXFwuPyg/OlxcL3wkKXxcXC98KFtBLVphLXpdOik/Wy9cXFxcXSkvLnRlc3QoeCkpIHtcbiAgICBsZXQgcmVzID0gcGF0aC5yZXNvbHZlKGJhc2VQYXRoLCB4KTtcbiAgICBpZiAoeCA9PT0gJy4uJyB8fCB4LnNsaWNlKC0xKSA9PT0gJy8nKSB7XG4gICAgICByZXMgKz0gJy8nO1xuICAgIH1cblxuICAgIGNvbnN0IG0gPSBsb2FkQXNGaWxlU3luYyhyZXMpIHx8IGxvYWRBc0RpcmVjdG9yeVN5bmMocmVzKTtcbiAgICBpZiAobSkge1xuICAgICAgcmV0dXJuIG07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IG4gPSBsb2FkTm9kZU1vZHVsZXNTeW5jKHgsIGJhc2VQYXRoKTtcbiAgICBpZiAobikge1xuICAgICAgcmV0dXJuIG47XG4gICAgfVxuICB9XG5cbiAgLy8gRmFsbGJhY2sgdG8gY2hlY2tpbmcgdGhlIGxvY2FsIChjYWxsZWUpIG5vZGUgbW9kdWxlcy5cbiAgaWYgKG9wdGlvbnMuY2hlY2tMb2NhbCkge1xuICAgIGNvbnN0IGNhbGxlcnMgPSBfY2FsbGVyKCk7XG4gICAgZm9yIChjb25zdCBjYWxsZXIgb2YgY2FsbGVycykge1xuICAgICAgY29uc3QgbG9jYWxEaXIgPSBwYXRoLmRpcm5hbWUoY2FsbGVyKTtcbiAgICAgIGlmIChsb2NhbERpciAhPT0gb3B0aW9ucy5iYXNlZGlyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoeCwge1xuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgIGNoZWNrTG9jYWw6IGZhbHNlLFxuICAgICAgICAgICAgY2hlY2tHbG9iYWw6IGZhbHNlLFxuICAgICAgICAgICAgYmFzZWRpcjogbG9jYWxEaXIsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBKdXN0IHN3YXAgdGhlIGJhc2VQYXRoIHdpdGggdGhlIG9yaWdpbmFsIGNhbGwgb25lLlxuICAgICAgICAgIGlmICghKGUgaW5zdGFuY2VvZiBNb2R1bGVOb3RGb3VuZEV4Y2VwdGlvbikpIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRmFsbGJhY2sgdG8gY2hlY2tpbmcgdGhlIGdsb2JhbCBub2RlIG1vZHVsZXMuXG4gIGlmIChvcHRpb25zLmNoZWNrR2xvYmFsKSB7XG4gICAgY29uc3QgZ2xvYmFsRGlyID0gcGF0aC5kaXJuYW1lKF9nZXRHbG9iYWxOb2RlTW9kdWxlcygpKTtcbiAgICBpZiAoZ2xvYmFsRGlyICE9PSBvcHRpb25zLmJhc2VkaXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKHgsIHtcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgIGNoZWNrTG9jYWw6IGZhbHNlLFxuICAgICAgICAgIGNoZWNrR2xvYmFsOiBmYWxzZSxcbiAgICAgICAgICBiYXNlZGlyOiBnbG9iYWxEaXIsXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBKdXN0IHN3YXAgdGhlIGJhc2VQYXRoIHdpdGggdGhlIG9yaWdpbmFsIGNhbGwgb25lLlxuICAgICAgICBpZiAoIShlIGluc3RhbmNlb2YgTW9kdWxlTm90Rm91bmRFeGNlcHRpb24pKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBNb2R1bGVOb3RGb3VuZEV4Y2VwdGlvbih4LCBiYXNlUGF0aCk7XG5cbiAgZnVuY3Rpb24gbG9hZEFzRmlsZVN5bmMoeDogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKGlzRmlsZSh4KSkge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV4dGVuc2lvbnMubWFwKGV4ID0+IHggKyBleCkuZmluZChmID0+IGlzRmlsZShmKSkgfHwgbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvYWRBc0RpcmVjdG9yeVN5bmMoeDogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgY29uc3QgcGtnZmlsZSA9IHBhdGguam9pbih4LCAncGFja2FnZS5qc29uJyk7XG4gICAgaWYgKGlzRmlsZShwa2dmaWxlKSkge1xuICAgICAgaWYgKG9wdGlvbnMucmVzb2x2ZVBhY2thZ2VKc29uKSB7XG4gICAgICAgIHJldHVybiBwa2dmaWxlO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBib2R5ID0gcmVhZEZpbGVTeW5jKHBrZ2ZpbGUsICdVVEY4Jyk7XG4gICAgICAgIGNvbnN0IHBrZyA9IEpTT04ucGFyc2UoYm9keSk7XG5cbiAgICAgICAgaWYgKHBrZ1snbWFpbiddKSB7XG4gICAgICAgICAgaWYgKHBrZ1snbWFpbiddID09PSAnLicgfHwgcGtnWydtYWluJ10gPT09ICcuLycpIHtcbiAgICAgICAgICAgIHBrZ1snbWFpbiddID0gJ2luZGV4JztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBtID0gbG9hZEFzRmlsZVN5bmMocGF0aC5yZXNvbHZlKHgsIHBrZ1snbWFpbiddKSk7XG4gICAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgIHJldHVybiBtO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBuID0gbG9hZEFzRGlyZWN0b3J5U3luYyhwYXRoLnJlc29sdmUoeCwgcGtnWydtYWluJ10pKTtcbiAgICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxvYWRBc0ZpbGVTeW5jKHBhdGguam9pbih4LCAnL2luZGV4JykpO1xuICB9XG5cbiAgZnVuY3Rpb24gbG9hZE5vZGVNb2R1bGVzU3luYyh4OiBzdHJpbmcsIHN0YXJ0OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBjb25zdCBkaXJzID0gbm9kZU1vZHVsZXNQYXRocyhzdGFydCwgb3B0aW9ucyk7XG4gICAgZm9yIChjb25zdCBkaXIgb2YgZGlycykge1xuICAgICAgY29uc3QgbSA9IGxvYWRBc0ZpbGVTeW5jKHBhdGguam9pbihkaXIsICcvJywgeCkpO1xuICAgICAgaWYgKG0pIHtcbiAgICAgICAgcmV0dXJuIG07XG4gICAgICB9XG4gICAgICBjb25zdCBuID0gbG9hZEFzRGlyZWN0b3J5U3luYyhwYXRoLmpvaW4oZGlyLCAnLycsIHgpKTtcbiAgICAgIGlmIChuKSB7XG4gICAgICAgIHJldHVybiBuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gbm9kZU1vZHVsZXNQYXRocyhzdGFydDogc3RyaW5nLCBvcHRzOiBSZXNvbHZlT3B0aW9ucykge1xuICAgIGNvbnN0IG1vZHVsZXMgPSBbJ25vZGVfbW9kdWxlcyddO1xuXG4gICAgLy8gZW5zdXJlIHRoYXQgYHN0YXJ0YCBpcyBhbiBhYnNvbHV0ZSBwYXRoIGF0IHRoaXMgcG9pbnQsXG4gICAgLy8gcmVzb2x2aW5nIGFnYWluc3QgdGhlIHByb2Nlc3MnIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnlcbiAgICBsZXQgYWJzb2x1dGVTdGFydCA9IHBhdGgucmVzb2x2ZShzdGFydCk7XG5cbiAgICBpZiAob3B0cyAmJiBvcHRzLnByZXNlcnZlU3ltbGlua3MgPT09IGZhbHNlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhYnNvbHV0ZVN0YXJ0ID0gZnMucmVhbHBhdGhTeW5jKGFic29sdXRlU3RhcnQpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIuY29kZSAhPT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcHJlZml4ID0gJy8nO1xuICAgIGlmICgvXihbQS1aYS16XTopLy50ZXN0KGFic29sdXRlU3RhcnQpKSB7XG4gICAgICBwcmVmaXggPSAnJztcbiAgICB9IGVsc2UgaWYgKC9eXFxcXFxcXFwvLnRlc3QoYWJzb2x1dGVTdGFydCkpIHtcbiAgICAgIHByZWZpeCA9ICdcXFxcXFxcXCc7XG4gICAgfVxuXG4gICAgY29uc3QgcGF0aHMgPSBbYWJzb2x1dGVTdGFydF07XG4gICAgbGV0IHBhcnNlZCA9IHBhdGgucGFyc2UoYWJzb2x1dGVTdGFydCk7XG4gICAgd2hpbGUgKHBhcnNlZC5kaXIgIT09IHBhdGhzW3BhdGhzLmxlbmd0aCAtIDFdKSB7XG4gICAgICBwYXRocy5wdXNoKHBhcnNlZC5kaXIpO1xuICAgICAgcGFyc2VkID0gcGF0aC5wYXJzZShwYXJzZWQuZGlyKTtcbiAgICB9XG5cbiAgICBjb25zdCBkaXJzID0gcGF0aHMucmVkdWNlKChkaXJzOiBzdHJpbmdbXSwgYVBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgcmV0dXJuIGRpcnMuY29uY2F0KG1vZHVsZXMubWFwKGZ1bmN0aW9uIChtb2R1bGVEaXIpIHtcbiAgICAgICAgcmV0dXJuIHBhdGguam9pbihwcmVmaXgsIGFQYXRoLCBtb2R1bGVEaXIpO1xuICAgICAgfSkpO1xuICAgIH0sIFtdKTtcblxuICAgIHJldHVybiBvcHRzICYmIG9wdHMucGF0aHMgPyBkaXJzLmNvbmNhdChvcHRzLnBhdGhzKSA6IGRpcnM7XG4gIH1cbn1cbiJdfQ==