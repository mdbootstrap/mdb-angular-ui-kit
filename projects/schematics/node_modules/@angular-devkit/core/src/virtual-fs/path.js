"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const exception_1 = require("../exception");
class InvalidPathException extends exception_1.BaseException {
    constructor(path) { super(`Path ${JSON.stringify(path)} is invalid.`); }
}
exports.InvalidPathException = InvalidPathException;
class PathMustBeAbsoluteException extends exception_1.BaseException {
    constructor(path) { super(`Path ${JSON.stringify(path)} must be absolute.`); }
}
exports.PathMustBeAbsoluteException = PathMustBeAbsoluteException;
class PathCannotBeFragmentException extends exception_1.BaseException {
    constructor(path) { super(`Path ${JSON.stringify(path)} cannot be made a fragment.`); }
}
exports.PathCannotBeFragmentException = PathCannotBeFragmentException;
/**
 * The Separator for normalized path.
 * @type {Path}
 */
exports.NormalizedSep = '/';
/**
 * The root of a normalized path.
 * @type {Path}
 */
exports.NormalizedRoot = exports.NormalizedSep;
/**
 * Split a path into multiple path fragments. Each fragments except the last one will end with
 * a path separator.
 * @param {Path} path The path to split.
 * @returns {Path[]} An array of path fragments.
 */
function split(path) {
    const fragments = path.split(exports.NormalizedSep).map(x => fragment(x));
    if (fragments[fragments.length - 1].length === 0) {
        fragments.pop();
    }
    return fragments;
}
exports.split = split;
/**
 *
 */
function extname(path) {
    const base = basename(path);
    const i = base.lastIndexOf('.');
    if (i < 1) {
        return '';
    }
    else {
        return base.substr(i);
    }
}
exports.extname = extname;
/**
 * Return the basename of the path, as a Path. See path.basename
 */
function basename(path) {
    const i = path.lastIndexOf(exports.NormalizedSep);
    if (i == -1) {
        return fragment(path);
    }
    else {
        return fragment(path.substr(path.lastIndexOf(exports.NormalizedSep) + 1));
    }
}
exports.basename = basename;
/**
 * Return the dirname of the path, as a Path. See path.dirname
 */
function dirname(path) {
    const index = path.lastIndexOf(exports.NormalizedSep);
    if (index === -1) {
        return '';
    }
    const endIndex = index === 0 ? 1 : index; // case of file under root: '/file'
    return normalize(path.substr(0, endIndex));
}
exports.dirname = dirname;
/**
 * Join multiple paths together, and normalize the result. Accepts strings that will be
 * normalized as well (but the original must be a path).
 */
function join(p1, ...others) {
    if (others.length > 0) {
        return normalize((p1 ? p1 + exports.NormalizedSep : '') + others.join(exports.NormalizedSep));
    }
    else {
        return p1;
    }
}
exports.join = join;
/**
 * Returns true if a path is absolute.
 */
function isAbsolute(p) {
    return p.startsWith(exports.NormalizedSep);
}
exports.isAbsolute = isAbsolute;
/**
 * Returns a path such that `join(from, relative(from, to)) == to`.
 * Both paths must be absolute, otherwise it does not make much sense.
 */
function relative(from, to) {
    if (!isAbsolute(from)) {
        throw new PathMustBeAbsoluteException(from);
    }
    if (!isAbsolute(to)) {
        throw new PathMustBeAbsoluteException(to);
    }
    let p;
    if (from == to) {
        p = '';
    }
    else {
        const splitFrom = from.split(exports.NormalizedSep);
        const splitTo = to.split(exports.NormalizedSep);
        while (splitFrom.length > 0 && splitTo.length > 0 && splitFrom[0] == splitTo[0]) {
            splitFrom.shift();
            splitTo.shift();
        }
        if (splitFrom.length == 0) {
            p = splitTo.join(exports.NormalizedSep);
        }
        else {
            p = splitFrom.map(_ => '..').concat(splitTo).join(exports.NormalizedSep);
        }
    }
    return normalize(p);
}
exports.relative = relative;
/**
 * Returns a Path that is the resolution of p2, from p1. If p2 is absolute, it will return p2,
 * otherwise will join both p1 and p2.
 */
function resolve(p1, p2) {
    if (isAbsolute(p2)) {
        return p2;
    }
    else {
        return join(p1, p2);
    }
}
exports.resolve = resolve;
function fragment(path) {
    if (path.indexOf(exports.NormalizedSep) != -1) {
        throw new PathCannotBeFragmentException(path);
    }
    return path;
}
exports.fragment = fragment;
/**
 * normalize() cache to reduce computation. For now this grows and we never flush it, but in the
 * future we might want to add a few cache flush to prevent this from growing too large.
 */
let normalizedCache = new Map();
/**
 * Reset the cache. This is only useful for testing.
 * @private
 */
function resetNormalizeCache() {
    normalizedCache = new Map();
}
exports.resetNormalizeCache = resetNormalizeCache;
/**
 * Normalize a string into a Path. This is the only mean to get a Path type from a string that
 * represents a system path. This method cache the results as real world paths tend to be
 * duplicated often.
 * Normalization includes:
 *   - Windows backslashes `\\` are replaced with `/`.
 *   - Windows drivers are replaced with `/X/`, where X is the drive letter.
 *   - Absolute paths starts with `/`.
 *   - Multiple `/` are replaced by a single one.
 *   - Path segments `.` are removed.
 *   - Path segments `..` are resolved.
 *   - If a path is absolute, having a `..` at the start is invalid (and will throw).
 * @param path The path to be normalized.
 */
function normalize(path) {
    let maybePath = normalizedCache.get(path);
    if (!maybePath) {
        maybePath = noCacheNormalize(path);
        normalizedCache.set(path, maybePath);
    }
    return maybePath;
}
exports.normalize = normalize;
/**
 * The no cache version of the normalize() function. Used for benchmarking and testing.
 */
function noCacheNormalize(path) {
    if (path == '' || path == '.') {
        return '';
    }
    else if (path == exports.NormalizedRoot) {
        return exports.NormalizedRoot;
    }
    // Match absolute windows path.
    const original = path;
    if (path.match(/^[A-Z]:[\/\\]/i)) {
        path = '\\' + path[0] + '\\' + path.substr(3);
    }
    // We convert Windows paths as well here.
    const p = path.split(/[\/\\]/g);
    let relative = false;
    let i = 1;
    // Special case the first one.
    if (p[0] != '') {
        p.unshift('.');
        relative = true;
    }
    while (i < p.length) {
        if (p[i] == '.') {
            p.splice(i, 1);
        }
        else if (p[i] == '..') {
            if (i < 2 && !relative) {
                throw new InvalidPathException(original);
            }
            else if (i >= 2 && p[i - 1] != '..') {
                p.splice(i - 1, 2);
                i--;
            }
            else {
                i++;
            }
        }
        else if (p[i] == '') {
            p.splice(i, 1);
        }
        else {
            i++;
        }
    }
    if (p.length == 1) {
        return p[0] == '' ? exports.NormalizedSep : '';
    }
    else {
        if (p[0] == '.') {
            p.shift();
        }
        return p.join(exports.NormalizedSep);
    }
}
exports.noCacheNormalize = noCacheNormalize;
exports.path = (strings, ...values) => {
    return normalize(String.raw(strings, ...values));
};
function asWindowsPath(path) {
    const drive = path.match(/^\/(\w)\/(.*)$/);
    if (drive) {
        return `${drive[1]}:\\${drive[2].replace(/\//g, '\\')}`;
    }
    return path.replace(/\//g, '\\');
}
exports.asWindowsPath = asWindowsPath;
function asPosixPath(path) {
    return path;
}
exports.asPosixPath = asPosixPath;
function getSystemPath(path) {
    if (process.platform.startsWith('win32')) {
        return asWindowsPath(path);
    }
    else {
        return asPosixPath(path);
    }
}
exports.getSystemPath = getSystemPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aC5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvdmlydHVhbC1mcy9wYXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsNENBQTZDO0FBSTdDLE1BQWEsb0JBQXFCLFNBQVEseUJBQWE7SUFDckQsWUFBWSxJQUFZLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ2pGO0FBRkQsb0RBRUM7QUFDRCxNQUFhLDJCQUE0QixTQUFRLHlCQUFhO0lBQzVELFlBQVksSUFBWSxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3ZGO0FBRkQsa0VBRUM7QUFDRCxNQUFhLDZCQUE4QixTQUFRLHlCQUFhO0lBQzlELFlBQVksSUFBWSxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ2hHO0FBRkQsc0VBRUM7QUFrQkQ7OztHQUdHO0FBQ1UsUUFBQSxhQUFhLEdBQUcsR0FBVyxDQUFDO0FBR3pDOzs7R0FHRztBQUNVLFFBQUEsY0FBYyxHQUFHLHFCQUFxQixDQUFDO0FBR3BEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFDLElBQVU7SUFDOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFF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LEVBQUU7WUFDZixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDWDtRQUVELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBYSxDQUFTLENBQUM7S0FDdEM7QUFDSCxDQUFDO0FBcERELDRDQW9EQztBQUdZLFFBQUEsSUFBSSxHQUFzQixDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sRUFBRSxFQUFFO0lBQzVELE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNuRCxDQUFDLENBQUM7QUFXRixTQUFnQixhQUFhLENBQUMsSUFBVTtJQUN0QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDM0MsSUFBSSxLQUFLLEVBQUU7UUFDVCxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFpQixDQUFDO0tBQ3hFO0lBRUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQWdCLENBQUM7QUFDbEQsQ0FBQztBQVBELHNDQU9DO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLElBQVU7SUFDcEMsT0FBTyxJQUEyQixDQUFDO0FBQ3JDLENBQUM7QUFGRCxrQ0FFQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxJQUFVO0lBQ3RDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDeEMsT0FBTyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDNUI7U0FBTTtRQUNMLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzFCO0FBQ0gsQ0FBQztBQU5ELHNDQU1DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgQmFzZUV4Y2VwdGlvbiB9IGZyb20gJy4uL2V4Y2VwdGlvbic7XG5pbXBvcnQgeyBUZW1wbGF0ZVRhZyB9IGZyb20gJy4uL3V0aWxzL2xpdGVyYWxzJztcblxuXG5leHBvcnQgY2xhc3MgSW52YWxpZFBhdGhFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7IHN1cGVyKGBQYXRoICR7SlNPTi5zdHJpbmdpZnkocGF0aCl9IGlzIGludmFsaWQuYCk7IH1cbn1cbmV4cG9ydCBjbGFzcyBQYXRoTXVzdEJlQWJzb2x1dGVFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7IHN1cGVyKGBQYXRoICR7SlNPTi5zdHJpbmdpZnkocGF0aCl9IG11c3QgYmUgYWJzb2x1dGUuYCk7IH1cbn1cbmV4cG9ydCBjbGFzcyBQYXRoQ2Fubm90QmVGcmFnbWVudEV4Y2VwdGlvbiBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHsgc3VwZXIoYFBhdGggJHtKU09OLnN0cmluZ2lmeShwYXRoKX0gY2Fubm90IGJlIG1hZGUgYSBmcmFnbWVudC5gKTsgfVxufVxuXG5cbi8qKlxuICogQSBQYXRoIHJlY29nbml6ZWQgYnkgbW9zdCBtZXRob2RzIGluIHRoZSBEZXZLaXQuXG4gKi9cbmV4cG9ydCB0eXBlIFBhdGggPSBzdHJpbmcgJiB7XG4gIF9fUFJJVkFURV9ERVZLSVRfUEFUSDogdm9pZDtcbn07XG5cbi8qKlxuICogQSBQYXRoIGZyYWdtZW50IChmaWxlIG9yIGRpcmVjdG9yeSBuYW1lKSByZWNvZ25pemVkIGJ5IG1vc3QgbWV0aG9kcyBpbiB0aGUgRGV2S2l0LlxuICovXG5leHBvcnQgdHlwZSBQYXRoRnJhZ21lbnQgPSBQYXRoICYge1xuICBfX1BSSVZBVEVfREVWS0lUX1BBVEhfRlJBR01FTlQ6IHZvaWQ7XG59O1xuXG5cbi8qKlxuICogVGhlIFNlcGFyYXRvciBmb3Igbm9ybWFsaXplZCBwYXRoLlxuICogQHR5cGUge1BhdGh9XG4gKi9cbmV4cG9ydCBjb25zdCBOb3JtYWxpemVkU2VwID0gJy8nIGFzIFBhdGg7XG5cblxuLyoqXG4gKiBUaGUgcm9vdCBvZiBhIG5vcm1hbGl6ZWQgcGF0aC5cbiAqIEB0eXBlIHtQYXRofVxuICovXG5leHBvcnQgY29uc3QgTm9ybWFsaXplZFJvb3QgPSBOb3JtYWxpemVkU2VwIGFzIFBhdGg7XG5cblxuLyoqXG4gKiBTcGxpdCBhIHBhdGggaW50byBtdWx0aXBsZSBwYXRoIGZyYWdtZW50cy4gRWFjaCBmcmFnbWVudHMgZXhjZXB0IHRoZSBsYXN0IG9uZSB3aWxsIGVuZCB3aXRoXG4gKiBhIHBhdGggc2VwYXJhdG9yLlxuICogQHBhcmFtIHtQYXRofSBwYXRoIFRoZSBwYXRoIHRvIHNwbGl0LlxuICogQHJldHVybnMge1BhdGhbXX0gQW4gYXJyYXkgb2YgcGF0aCBmcmFnbWVudHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdChwYXRoOiBQYXRoKTogUGF0aEZyYWdtZW50W10ge1xuICBjb25zdCBmcmFnbWVudHMgPSBwYXRoLnNwbGl0KE5vcm1hbGl6ZWRTZXApLm1hcCh4ID0+IGZyYWdtZW50KHgpKTtcbiAgaWYgKGZyYWdtZW50c1tmcmFnbWVudHMubGVuZ3RoIC0gMV0ubGVuZ3RoID09PSAwKSB7XG4gICAgZnJhZ21lbnRzLnBvcCgpO1xuICB9XG5cbiAgcmV0dXJuIGZyYWdtZW50cztcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0bmFtZShwYXRoOiBQYXRoKTogc3RyaW5nIHtcbiAgY29uc3QgYmFzZSA9IGJhc2VuYW1lKHBhdGgpO1xuICBjb25zdCBpID0gYmFzZS5sYXN0SW5kZXhPZignLicpO1xuICBpZiAoaSA8IDEpIHtcbiAgICByZXR1cm4gJyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2Uuc3Vic3RyKGkpO1xuICB9XG59XG5cblxuLyoqXG4gKiBSZXR1cm4gdGhlIGJhc2VuYW1lIG9mIHRoZSBwYXRoLCBhcyBhIFBhdGguIFNlZSBwYXRoLmJhc2VuYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiYXNlbmFtZShwYXRoOiBQYXRoKTogUGF0aEZyYWdtZW50IHtcbiAgY29uc3QgaSA9IHBhdGgubGFzdEluZGV4T2YoTm9ybWFsaXplZFNlcCk7XG4gIGlmIChpID09IC0xKSB7XG4gICAgcmV0dXJuIGZyYWdtZW50KHBhdGgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmcmFnbWVudChwYXRoLnN1YnN0cihwYXRoLmxhc3RJbmRleE9mKE5vcm1hbGl6ZWRTZXApICsgMSkpO1xuICB9XG59XG5cblxuLyoqXG4gKiBSZXR1cm4gdGhlIGRpcm5hbWUgb2YgdGhlIHBhdGgsIGFzIGEgUGF0aC4gU2VlIHBhdGguZGlybmFtZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlybmFtZShwYXRoOiBQYXRoKTogUGF0aCB7XG4gIGNvbnN0IGluZGV4ID0gcGF0aC5sYXN0SW5kZXhPZihOb3JtYWxpemVkU2VwKTtcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHJldHVybiAnJyBhcyBQYXRoO1xuICB9XG5cbiAgY29uc3QgZW5kSW5kZXggPSBpbmRleCA9PT0gMCA/IDEgOiBpbmRleDsgLy8gY2FzZSBvZiBmaWxlIHVuZGVyIHJvb3Q6ICcvZmlsZSdcblxuICByZXR1cm4gbm9ybWFsaXplKHBhdGguc3Vic3RyKDAsIGVuZEluZGV4KSk7XG59XG5cblxuLyoqXG4gKiBKb2luIG11bHRpcGxlIHBhdGhzIHRvZ2V0aGVyLCBhbmQgbm9ybWFsaXplIHRoZSByZXN1bHQuIEFjY2VwdHMgc3RyaW5ncyB0aGF0IHdpbGwgYmVcbiAqIG5vcm1hbGl6ZWQgYXMgd2VsbCAoYnV0IHRoZSBvcmlnaW5hbCBtdXN0IGJlIGEgcGF0aCkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBqb2luKHAxOiBQYXRoLCAuLi5vdGhlcnM6IHN0cmluZ1tdKTogUGF0aCB7XG4gIGlmIChvdGhlcnMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBub3JtYWxpemUoKHAxID8gcDEgKyBOb3JtYWxpemVkU2VwIDogJycpICsgb3RoZXJzLmpvaW4oTm9ybWFsaXplZFNlcCkpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwMTtcbiAgfVxufVxuXG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIGEgcGF0aCBpcyBhYnNvbHV0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQWJzb2x1dGUocDogUGF0aCkge1xuICByZXR1cm4gcC5zdGFydHNXaXRoKE5vcm1hbGl6ZWRTZXApO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyBhIHBhdGggc3VjaCB0aGF0IGBqb2luKGZyb20sIHJlbGF0aXZlKGZyb20sIHRvKSkgPT0gdG9gLlxuICogQm90aCBwYXRocyBtdXN0IGJlIGFic29sdXRlLCBvdGhlcndpc2UgaXQgZG9lcyBub3QgbWFrZSBtdWNoIHNlbnNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVsYXRpdmUoZnJvbTogUGF0aCwgdG86IFBhdGgpOiBQYXRoIHtcbiAgaWYgKCFpc0Fic29sdXRlKGZyb20pKSB7XG4gICAgdGhyb3cgbmV3IFBhdGhNdXN0QmVBYnNvbHV0ZUV4Y2VwdGlvbihmcm9tKTtcbiAgfVxuICBpZiAoIWlzQWJzb2x1dGUodG8pKSB7XG4gICAgdGhyb3cgbmV3IFBhdGhNdXN0QmVBYnNvbHV0ZUV4Y2VwdGlvbih0byk7XG4gIH1cblxuICBsZXQgcDogc3RyaW5nO1xuXG4gIGlmIChmcm9tID09IHRvKSB7XG4gICAgcCA9ICcnO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNwbGl0RnJvbSA9IGZyb20uc3BsaXQoTm9ybWFsaXplZFNlcCk7XG4gICAgY29uc3Qgc3BsaXRUbyA9IHRvLnNwbGl0KE5vcm1hbGl6ZWRTZXApO1xuXG4gICAgd2hpbGUgKHNwbGl0RnJvbS5sZW5ndGggPiAwICYmIHNwbGl0VG8ubGVuZ3RoID4gMCAmJiBzcGxpdEZyb21bMF0gPT0gc3BsaXRUb1swXSkge1xuICAgICAgc3BsaXRGcm9tLnNoaWZ0KCk7XG4gICAgICBzcGxpdFRvLnNoaWZ0KCk7XG4gICAgfVxuXG4gICAgaWYgKHNwbGl0RnJvbS5sZW5ndGggPT0gMCkge1xuICAgICAgcCA9IHNwbGl0VG8uam9pbihOb3JtYWxpemVkU2VwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcCA9IHNwbGl0RnJvbS5tYXAoXyA9PiAnLi4nKS5jb25jYXQoc3BsaXRUbykuam9pbihOb3JtYWxpemVkU2VwKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbm9ybWFsaXplKHApO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyBhIFBhdGggdGhhdCBpcyB0aGUgcmVzb2x1dGlvbiBvZiBwMiwgZnJvbSBwMS4gSWYgcDIgaXMgYWJzb2x1dGUsIGl0IHdpbGwgcmV0dXJuIHAyLFxuICogb3RoZXJ3aXNlIHdpbGwgam9pbiBib3RoIHAxIGFuZCBwMi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmUocDE6IFBhdGgsIHAyOiBQYXRoKSB7XG4gIGlmIChpc0Fic29sdXRlKHAyKSkge1xuICAgIHJldHVybiBwMjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gam9pbihwMSwgcDIpO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGZyYWdtZW50KHBhdGg6IHN0cmluZyk6IFBhdGhGcmFnbWVudCB7XG4gIGlmIChwYXRoLmluZGV4T2YoTm9ybWFsaXplZFNlcCkgIT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgUGF0aENhbm5vdEJlRnJhZ21lbnRFeGNlcHRpb24ocGF0aCk7XG4gIH1cblxuICByZXR1cm4gcGF0aCBhcyBQYXRoRnJhZ21lbnQ7XG59XG5cblxuLyoqXG4gKiBub3JtYWxpemUoKSBjYWNoZSB0byByZWR1Y2UgY29tcHV0YXRpb24uIEZvciBub3cgdGhpcyBncm93cyBhbmQgd2UgbmV2ZXIgZmx1c2ggaXQsIGJ1dCBpbiB0aGVcbiAqIGZ1dHVyZSB3ZSBtaWdodCB3YW50IHRvIGFkZCBhIGZldyBjYWNoZSBmbHVzaCB0byBwcmV2ZW50IHRoaXMgZnJvbSBncm93aW5nIHRvbyBsYXJnZS5cbiAqL1xubGV0IG5vcm1hbGl6ZWRDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBQYXRoPigpO1xuXG5cbi8qKlxuICogUmVzZXQgdGhlIGNhY2hlLiBUaGlzIGlzIG9ubHkgdXNlZnVsIGZvciB0ZXN0aW5nLlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0Tm9ybWFsaXplQ2FjaGUoKSB7XG4gIG5vcm1hbGl6ZWRDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBQYXRoPigpO1xufVxuXG5cbi8qKlxuICogTm9ybWFsaXplIGEgc3RyaW5nIGludG8gYSBQYXRoLiBUaGlzIGlzIHRoZSBvbmx5IG1lYW4gdG8gZ2V0IGEgUGF0aCB0eXBlIGZyb20gYSBzdHJpbmcgdGhhdFxuICogcmVwcmVzZW50cyBhIHN5c3RlbSBwYXRoLiBUaGlzIG1ldGhvZCBjYWNoZSB0aGUgcmVzdWx0cyBhcyByZWFsIHdvcmxkIHBhdGhzIHRlbmQgdG8gYmVcbiAqIGR1cGxpY2F0ZWQgb2Z0ZW4uXG4gKiBOb3JtYWxpemF0aW9uIGluY2x1ZGVzOlxuICogICAtIFdpbmRvd3MgYmFja3NsYXNoZXMgYFxcXFxgIGFyZSByZXBsYWNlZCB3aXRoIGAvYC5cbiAqICAgLSBXaW5kb3dzIGRyaXZlcnMgYXJlIHJlcGxhY2VkIHdpdGggYC9YL2AsIHdoZXJlIFggaXMgdGhlIGRyaXZlIGxldHRlci5cbiAqICAgLSBBYnNvbHV0ZSBwYXRocyBzdGFydHMgd2l0aCBgL2AuXG4gKiAgIC0gTXVsdGlwbGUgYC9gIGFyZSByZXBsYWNlZCBieSBhIHNpbmdsZSBvbmUuXG4gKiAgIC0gUGF0aCBzZWdtZW50cyBgLmAgYXJlIHJlbW92ZWQuXG4gKiAgIC0gUGF0aCBzZWdtZW50cyBgLi5gIGFyZSByZXNvbHZlZC5cbiAqICAgLSBJZiBhIHBhdGggaXMgYWJzb2x1dGUsIGhhdmluZyBhIGAuLmAgYXQgdGhlIHN0YXJ0IGlzIGludmFsaWQgKGFuZCB3aWxsIHRocm93KS5cbiAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIHRvIGJlIG5vcm1hbGl6ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUocGF0aDogc3RyaW5nKTogUGF0aCB7XG4gIGxldCBtYXliZVBhdGggPSBub3JtYWxpemVkQ2FjaGUuZ2V0KHBhdGgpO1xuICBpZiAoIW1heWJlUGF0aCkge1xuICAgIG1heWJlUGF0aCA9IG5vQ2FjaGVOb3JtYWxpemUocGF0aCk7XG4gICAgbm9ybWFsaXplZENhY2hlLnNldChwYXRoLCBtYXliZVBhdGgpO1xuICB9XG5cbiAgcmV0dXJuIG1heWJlUGF0aDtcbn1cblxuXG4vKipcbiAqIFRoZSBubyBjYWNoZSB2ZXJzaW9uIG9mIHRoZSBub3JtYWxpemUoKSBmdW5jdGlvbi4gVXNlZCBmb3IgYmVuY2htYXJraW5nIGFuZCB0ZXN0aW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9DYWNoZU5vcm1hbGl6ZShwYXRoOiBzdHJpbmcpOiBQYXRoIHtcbiAgaWYgKHBhdGggPT0gJycgfHwgcGF0aCA9PSAnLicpIHtcbiAgICByZXR1cm4gJycgYXMgUGF0aDtcbiAgfSBlbHNlIGlmIChwYXRoID09IE5vcm1hbGl6ZWRSb290KSB7XG4gICAgcmV0dXJuIE5vcm1hbGl6ZWRSb290O1xuICB9XG5cbiAgLy8gTWF0Y2ggYWJzb2x1dGUgd2luZG93cyBwYXRoLlxuICBjb25zdCBvcmlnaW5hbCA9IHBhdGg7XG4gIGlmIChwYXRoLm1hdGNoKC9eW0EtWl06W1xcL1xcXFxdL2kpKSB7XG4gICAgcGF0aCA9ICdcXFxcJyArIHBhdGhbMF0gKyAnXFxcXCcgKyBwYXRoLnN1YnN0cigzKTtcbiAgfVxuXG4gIC8vIFdlIGNvbnZlcnQgV2luZG93cyBwYXRocyBhcyB3ZWxsIGhlcmUuXG4gIGNvbnN0IHAgPSBwYXRoLnNwbGl0KC9bXFwvXFxcXF0vZyk7XG4gIGxldCByZWxhdGl2ZSA9IGZhbHNlO1xuICBsZXQgaSA9IDE7XG5cbiAgLy8gU3BlY2lhbCBjYXNlIHRoZSBmaXJzdCBvbmUuXG4gIGlmIChwWzBdICE9ICcnKSB7XG4gICAgcC51bnNoaWZ0KCcuJyk7XG4gICAgcmVsYXRpdmUgPSB0cnVlO1xuICB9XG5cbiAgd2hpbGUgKGkgPCBwLmxlbmd0aCkge1xuICAgIGlmIChwW2ldID09ICcuJykge1xuICAgICAgcC5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChwW2ldID09ICcuLicpIHtcbiAgICAgIGlmIChpIDwgMiAmJiAhcmVsYXRpdmUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEludmFsaWRQYXRoRXhjZXB0aW9uKG9yaWdpbmFsKTtcbiAgICAgIH0gZWxzZSBpZiAoaSA+PSAyICYmIHBbaSAtIDFdICE9ICcuLicpIHtcbiAgICAgICAgcC5zcGxpY2UoaSAtIDEsIDIpO1xuICAgICAgICBpLS07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChwW2ldID09ICcnKSB7XG4gICAgICBwLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaSsrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwLmxlbmd0aCA9PSAxKSB7XG4gICAgcmV0dXJuIHBbMF0gPT0gJycgPyBOb3JtYWxpemVkU2VwIDogJycgYXMgUGF0aDtcbiAgfSBlbHNlIHtcbiAgICBpZiAocFswXSA9PSAnLicpIHtcbiAgICAgIHAuc2hpZnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcC5qb2luKE5vcm1hbGl6ZWRTZXApIGFzIFBhdGg7XG4gIH1cbn1cblxuXG5leHBvcnQgY29uc3QgcGF0aDogVGVtcGxhdGVUYWc8UGF0aD4gPSAoc3RyaW5ncywgLi4udmFsdWVzKSA9PiB7XG4gIHJldHVybiBub3JtYWxpemUoU3RyaW5nLnJhdyhzdHJpbmdzLCAuLi52YWx1ZXMpKTtcbn07XG5cblxuLy8gUGxhdGZvcm0tc3BlY2lmaWMgcGF0aHMuXG5leHBvcnQgdHlwZSBXaW5kb3dzUGF0aCA9IHN0cmluZyAmIHtcbiAgX19QUklWQVRFX0RFVktJVF9XSU5ET1dTX1BBVEg6IHZvaWQ7XG59O1xuZXhwb3J0IHR5cGUgUG9zaXhQYXRoID0gc3RyaW5nICYge1xuICBfX1BSSVZBVEVfREVWS0lUX1BPU0lYX1BBVEg6IHZvaWQ7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gYXNXaW5kb3dzUGF0aChwYXRoOiBQYXRoKTogV2luZG93c1BhdGgge1xuICBjb25zdCBkcml2ZSA9IHBhdGgubWF0Y2goL15cXC8oXFx3KVxcLyguKikkLyk7XG4gIGlmIChkcml2ZSkge1xuICAgIHJldHVybiBgJHtkcml2ZVsxXX06XFxcXCR7ZHJpdmVbMl0ucmVwbGFjZSgvXFwvL2csICdcXFxcJyl9YCBhcyBXaW5kb3dzUGF0aDtcbiAgfVxuXG4gIHJldHVybiBwYXRoLnJlcGxhY2UoL1xcLy9nLCAnXFxcXCcpIGFzIFdpbmRvd3NQYXRoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNQb3NpeFBhdGgocGF0aDogUGF0aCk6IFBvc2l4UGF0aCB7XG4gIHJldHVybiBwYXRoIGFzIHN0cmluZyBhcyBQb3NpeFBhdGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTeXN0ZW1QYXRoKHBhdGg6IFBhdGgpOiBzdHJpbmcge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybS5zdGFydHNXaXRoKCd3aW4zMicpKSB7XG4gICAgcmV0dXJuIGFzV2luZG93c1BhdGgocGF0aCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGFzUG9zaXhQYXRoKHBhdGgpO1xuICB9XG59XG4iXX0=