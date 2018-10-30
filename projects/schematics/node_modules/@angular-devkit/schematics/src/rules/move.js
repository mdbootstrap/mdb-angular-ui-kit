"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const base_1 = require("./base");
function move(from, to) {
    if (to === undefined) {
        to = from;
        from = '/';
    }
    const fromPath = core_1.normalize('/' + from);
    const toPath = core_1.normalize('/' + to);
    if (fromPath === toPath) {
        return base_1.noop;
    }
    return tree => tree.visit(path => {
        if (path.startsWith(fromPath)) {
            tree.rename(path, toPath + '/' + path.substr(fromPath.length));
        }
    });
}
exports.move = move;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW92ZS5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy9zcmMvcnVsZXMvbW92ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQUFpRDtBQUVqRCxpQ0FBOEI7QUFHOUIsU0FBZ0IsSUFBSSxDQUFDLElBQVksRUFBRSxFQUFXO0lBQzVDLElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtRQUNwQixFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ1YsSUFBSSxHQUFHLEdBQUcsQ0FBQztLQUNaO0lBRUQsTUFBTSxRQUFRLEdBQUcsZ0JBQVMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDdkMsTUFBTSxNQUFNLEdBQUcsZ0JBQVMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFFbkMsSUFBSSxRQUFRLEtBQUssTUFBTSxFQUFFO1FBQ3ZCLE9BQU8sV0FBSSxDQUFDO0tBQ2I7SUFFRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMvQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ2hFO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBbEJELG9CQWtCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IG5vcm1hbGl6ZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IFJ1bGUgfSBmcm9tICcuLi9lbmdpbmUvaW50ZXJmYWNlJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuL2Jhc2UnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlKGZyb206IHN0cmluZywgdG8/OiBzdHJpbmcpOiBSdWxlIHtcbiAgaWYgKHRvID09PSB1bmRlZmluZWQpIHtcbiAgICB0byA9IGZyb207XG4gICAgZnJvbSA9ICcvJztcbiAgfVxuXG4gIGNvbnN0IGZyb21QYXRoID0gbm9ybWFsaXplKCcvJyArIGZyb20pO1xuICBjb25zdCB0b1BhdGggPSBub3JtYWxpemUoJy8nICsgdG8pO1xuXG4gIGlmIChmcm9tUGF0aCA9PT0gdG9QYXRoKSB7XG4gICAgcmV0dXJuIG5vb3A7XG4gIH1cblxuICByZXR1cm4gdHJlZSA9PiB0cmVlLnZpc2l0KHBhdGggPT4ge1xuICAgIGlmIChwYXRoLnN0YXJ0c1dpdGgoZnJvbVBhdGgpKSB7XG4gICAgICB0cmVlLnJlbmFtZShwYXRoLCB0b1BhdGggKyAnLycgKyBwYXRoLnN1YnN0cihmcm9tUGF0aC5sZW5ndGgpKTtcbiAgICB9XG4gIH0pO1xufVxuIl19