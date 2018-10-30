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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const exception_1 = require("../exception/exception");
const entry_1 = require("./entry");
const interface_1 = require("./interface");
const recorder_1 = require("./recorder");
let _uniqueId = 0;
class HostDirEntry {
    constructor(parent, path, _host, _tree) {
        this.parent = parent;
        this.path = path;
        this._host = _host;
        this._tree = _tree;
    }
    get subdirs() {
        return this._host.list(this.path)
            .filter(fragment => this._host.isDirectory(core_1.join(this.path, fragment)));
    }
    get subfiles() {
        return this._host.list(this.path)
            .filter(fragment => this._host.isFile(core_1.join(this.path, fragment)));
    }
    dir(name) {
        return this._tree.getDir(core_1.join(this.path, name));
    }
    file(name) {
        return this._tree.get(core_1.join(this.path, name));
    }
    visit(visitor) {
        function _recurse(entry) {
            entry.subfiles.forEach(path => {
                visitor(core_1.join(entry.path, path), entry.file(path));
            });
            entry.subdirs.forEach(path => {
                _recurse(entry.dir(path));
            });
        }
        try {
            _recurse(this);
        }
        catch (e) {
            if (e !== interface_1.FileVisitorCancelToken) {
                throw e;
            }
        }
    }
}
exports.HostDirEntry = HostDirEntry;
class HostTree {
    constructor(_backend = new core_1.virtualFs.Empty()) {
        this._backend = _backend;
        this._id = --_uniqueId;
        this._ancestry = new Set();
        this._dirCache = new Map();
        this._record = new core_1.virtualFs.CordHost(new core_1.virtualFs.SafeReadonlyHost(_backend));
        this._recordSync = new core_1.virtualFs.SyncDelegateHost(this._record);
    }
    [interface_1.TreeSymbol]() {
        return this;
    }
    static isHostTree(tree) {
        if (tree instanceof HostTree) {
            return true;
        }
        if (typeof tree === 'object' && typeof tree._ancestry === 'object') {
            return true;
        }
        return false;
    }
    _normalizePath(path) {
        return core_1.normalize('/' + path);
    }
    _willCreate(path) {
        return this._record.willCreate(path);
    }
    _willOverwrite(path) {
        return this._record.willOverwrite(path);
    }
    _willDelete(path) {
        return this._record.willDelete(path);
    }
    _willRename(path) {
        return this._record.willRename(path);
    }
    // This can be used by old Schematics library with new Trees in some corner cases.
    // TODO: remove this for 7.0
    optimize() {
        return this;
    }
    branch() {
        const branchedTree = new HostTree(this._backend);
        branchedTree._record = this._record.clone();
        branchedTree._recordSync = new core_1.virtualFs.SyncDelegateHost(branchedTree._record);
        branchedTree._ancestry = new Set(this._ancestry).add(this._id);
        return branchedTree;
    }
    merge(other, strategy = interface_1.MergeStrategy.Default) {
        if (other === this) {
            // Merging with yourself? Tsk tsk. Nothing to do at least.
            return;
        }
        if (other instanceof HostTree && other._ancestry.has(this._id)) {
            // Workaround for merging a branch back into one of its ancestors
            // More complete branch point tracking is required to avoid
            strategy |= interface_1.MergeStrategy.Overwrite;
        }
        const creationConflictAllowed = (strategy & interface_1.MergeStrategy.AllowCreationConflict) == interface_1.MergeStrategy.AllowCreationConflict;
        const overwriteConflictAllowed = (strategy & interface_1.MergeStrategy.AllowOverwriteConflict) == interface_1.MergeStrategy.AllowOverwriteConflict;
        const deleteConflictAllowed = (strategy & interface_1.MergeStrategy.AllowOverwriteConflict) == interface_1.MergeStrategy.AllowDeleteConflict;
        other.actions.forEach(action => {
            switch (action.kind) {
                case 'c': {
                    const { path, content } = action;
                    if ((this._willCreate(path) || this._willOverwrite(path))) {
                        const existingContent = this.read(path);
                        if (existingContent && content.equals(existingContent)) {
                            // Identical outcome; no action required
                            return;
                        }
                        if (!creationConflictAllowed) {
                            throw new exception_1.MergeConflictException(path);
                        }
                        this._record.overwrite(path, content).subscribe();
                    }
                    else {
                        this._record.create(path, content).subscribe();
                    }
                    return;
                }
                case 'o': {
                    const { path, content } = action;
                    if (this._willDelete(path) && !overwriteConflictAllowed) {
                        throw new exception_1.MergeConflictException(path);
                    }
                    // Ignore if content is the same (considered the same change).
                    if (this._willOverwrite(path)) {
                        const existingContent = this.read(path);
                        if (existingContent && content.equals(existingContent)) {
                            // Identical outcome; no action required
                            return;
                        }
                        if (!overwriteConflictAllowed) {
                            throw new exception_1.MergeConflictException(path);
                        }
                    }
                    // We use write here as merge validation has already been done, and we want to let
                    // the CordHost do its job.
                    this._record.write(path, content).subscribe();
                    return;
                }
                case 'r': {
                    const { path, to } = action;
                    if (this._willDelete(path)) {
                        throw new exception_1.MergeConflictException(path);
                    }
                    if (this._willRename(path)) {
                        if (this._record.willRenameTo(path, to)) {
                            // Identical outcome; no action required
                            return;
                        }
                        // No override possible for renaming.
                        throw new exception_1.MergeConflictException(path);
                    }
                    this.rename(path, to);
                    return;
                }
                case 'd': {
                    const { path } = action;
                    if (this._willDelete(path)) {
                        // TODO: This should technically check the content (e.g., hash on delete)
                        // Identical outcome; no action required
                        return;
                    }
                    if (!this.exists(path) && !deleteConflictAllowed) {
                        throw new exception_1.MergeConflictException(path);
                    }
                    this._recordSync.delete(path);
                    return;
                }
            }
        });
    }
    get root() {
        return this.getDir('/');
    }
    // Readonly.
    read(path) {
        const entry = this.get(path);
        return entry ? entry.content : null;
    }
    exists(path) {
        return this._recordSync.isFile(this._normalizePath(path));
    }
    get(path) {
        const p = this._normalizePath(path);
        if (this._recordSync.isDirectory(p)) {
            throw new core_1.PathIsDirectoryException(p);
        }
        if (!this._recordSync.exists(p)) {
            return null;
        }
        return new entry_1.LazyFileEntry(p, () => Buffer.from(this._recordSync.read(p)));
    }
    getDir(path) {
        const p = this._normalizePath(path);
        if (this._recordSync.isFile(p)) {
            throw new core_1.PathIsFileException(p);
        }
        let maybeCache = this._dirCache.get(p);
        if (!maybeCache) {
            let parent = core_1.dirname(p);
            if (p === parent) {
                parent = null;
            }
            maybeCache = new HostDirEntry(parent && this.getDir(parent), p, this._recordSync, this);
            this._dirCache.set(p, maybeCache);
        }
        return maybeCache;
    }
    visit(visitor) {
        const allFiles = [];
        this.root.visit((path, entry) => {
            allFiles.push([path, entry]);
        });
        allFiles.forEach(([path, entry]) => visitor(path, entry));
    }
    // Change content of host files.
    overwrite(path, content) {
        const p = this._normalizePath(path);
        if (!this._recordSync.exists(p)) {
            throw new exception_1.FileDoesNotExistException(p);
        }
        const c = typeof content == 'string' ? Buffer.from(content) : content;
        this._record.overwrite(p, c).subscribe();
    }
    beginUpdate(path) {
        const entry = this.get(path);
        if (!entry) {
            throw new exception_1.FileDoesNotExistException(path);
        }
        return recorder_1.UpdateRecorderBase.createFromFileEntry(entry);
    }
    commitUpdate(record) {
        if (record instanceof recorder_1.UpdateRecorderBase) {
            const path = record.path;
            const entry = this.get(path);
            if (!entry) {
                throw new exception_1.ContentHasMutatedException(path);
            }
            else {
                const newContent = record.apply(entry.content);
                this.overwrite(path, newContent);
            }
        }
        else {
            throw new exception_1.InvalidUpdateRecordException();
        }
    }
    // Structural methods.
    create(path, content) {
        const p = this._normalizePath(path);
        if (this._recordSync.exists(p)) {
            throw new exception_1.FileAlreadyExistException(p);
        }
        const c = typeof content == 'string' ? Buffer.from(content) : content;
        this._record.create(p, c).subscribe();
    }
    delete(path) {
        this._recordSync.delete(this._normalizePath(path));
    }
    rename(from, to) {
        this._recordSync.rename(this._normalizePath(from), this._normalizePath(to));
    }
    apply(action, strategy) {
        throw new exception_1.SchematicsException('Apply not implemented on host trees.');
    }
    get actions() {
        // Create a list of all records until we hit our original backend. This is to support branches
        // that diverge from each others.
        const allRecords = [...this._record.records()];
        return core_1.clean(allRecords
            .map(record => {
            switch (record.kind) {
                case 'create':
                    return {
                        id: this._id,
                        parent: 0,
                        kind: 'c',
                        path: record.path,
                        content: Buffer.from(record.content),
                    };
                case 'overwrite':
                    return {
                        id: this._id,
                        parent: 0,
                        kind: 'o',
                        path: record.path,
                        content: Buffer.from(record.content),
                    };
                case 'rename':
                    return {
                        id: this._id,
                        parent: 0,
                        kind: 'r',
                        path: record.from,
                        to: record.to,
                    };
                case 'delete':
                    return {
                        id: this._id,
                        parent: 0,
                        kind: 'd',
                        path: record.path,
                    };
                default:
                    return;
            }
        }));
    }
}
exports.HostTree = HostTree;
class HostCreateTree extends HostTree {
    constructor(host) {
        super();
        const tempHost = new HostTree(host);
        tempHost.visit(path => {
            const content = tempHost.read(path);
            if (content) {
                this.create(path, content);
            }
        });
    }
}
exports.HostCreateTree = HostCreateTree;
class FilterHostTree extends HostTree {
    constructor(tree, filter = () => true) {
        const newBackend = new core_1.virtualFs.SimpleMemoryHost();
        // cast to allow access
        const originalBackend = tree._backend;
        const recurse = base => {
            return originalBackend.list(base)
                .pipe(operators_1.mergeMap(x => x), operators_1.map(path => core_1.join(base, path)), operators_1.concatMap(path => {
                let isDirectory = false;
                originalBackend.isDirectory(path).subscribe(val => isDirectory = val);
                if (isDirectory) {
                    return recurse(path);
                }
                let isFile = false;
                originalBackend.isFile(path).subscribe(val => isFile = val);
                if (!isFile || !filter(path)) {
                    return rxjs_1.of();
                }
                let content = null;
                originalBackend.read(path).subscribe(val => content = val);
                if (!content) {
                    return rxjs_1.of();
                }
                return newBackend.write(path, content);
            }));
        };
        recurse(core_1.normalize('/')).subscribe();
        super(newBackend);
        for (const action of tree.actions) {
            if (!filter(action.path)) {
                continue;
            }
            switch (action.kind) {
                case 'c':
                    this.create(action.path, action.content);
                    break;
                case 'd':
                    this.delete(action.path);
                    break;
                case 'o':
                    this.overwrite(action.path, action.content);
                    break;
                case 'r':
                    this.rename(action.path, action.to);
                    break;
            }
        }
    }
}
exports.FilterHostTree = FilterHostTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC10cmVlLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy90cmVlL2hvc3QtdHJlZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQVU4QjtBQUM5QiwrQkFBc0M7QUFDdEMsOENBQTBEO0FBQzFELHNEQU9nQztBQVFoQyxtQ0FBd0M7QUFDeEMsMkNBVXFCO0FBQ3JCLHlDQUFnRDtBQUdoRCxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFHbEIsTUFBYSxZQUFZO0lBQ3ZCLFlBQ1csTUFBdUIsRUFDdkIsSUFBVSxFQUNULEtBQWlDLEVBQ2pDLEtBQVc7UUFIWixXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUN2QixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1QsVUFBSyxHQUFMLEtBQUssQ0FBNEI7UUFDakMsVUFBSyxHQUFMLEtBQUssQ0FBTTtJQUNwQixDQUFDO0lBRUosSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBQ0QsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsR0FBRyxDQUFDLElBQWtC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LENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVwQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFbEIsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN4QixTQUFTO2FBQ1Y7WUFFRCxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLEtBQUssR0FBRztvQkFDTixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN6QyxNQUFNO2dCQUNSLEtBQUssR0FBRztvQkFDTixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDekIsTUFBTTtnQkFDUixLQUFLLEdBQUc7b0JBQ04sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDNUMsTUFBTTtnQkFDUixLQUFLLEdBQUc7b0JBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDcEMsTUFBTTthQUNUO1NBQ0Y7SUFDSCxDQUFDO0NBQ0Y7QUE1REQsd0NBNERDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgUGF0aCxcbiAgUGF0aEZyYWdtZW50LFxuICBQYXRoSXNEaXJlY3RvcnlFeGNlcHRpb24sXG4gIFBhdGhJc0ZpbGVFeGNlcHRpb24sXG4gIGNsZWFuLFxuICBkaXJuYW1lLFxuICBqb2luLFxuICBub3JtYWxpemUsXG4gIHZpcnR1YWxGcyxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNvbmNhdE1hcCwgbWFwLCBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7XG4gIENvbnRlbnRIYXNNdXRhdGVkRXhjZXB0aW9uLFxuICBGaWxlQWxyZWFkeUV4aXN0RXhjZXB0aW9uLFxuICBGaWxlRG9lc05vdEV4aXN0RXhjZXB0aW9uLFxuICBJbnZhbGlkVXBkYXRlUmVjb3JkRXhjZXB0aW9uLFxuICBNZXJnZUNvbmZsaWN0RXhjZXB0aW9uLFxuICBTY2hlbWF0aWNzRXhjZXB0aW9uLFxufSBmcm9tICcuLi9leGNlcHRpb24vZXhjZXB0aW9uJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQ3JlYXRlRmlsZUFjdGlvbixcbiAgRGVsZXRlRmlsZUFjdGlvbixcbiAgT3ZlcndyaXRlRmlsZUFjdGlvbixcbiAgUmVuYW1lRmlsZUFjdGlvbixcbn0gZnJvbSAnLi9hY3Rpb24nO1xuaW1wb3J0IHsgTGF6eUZpbGVFbnRyeSB9IGZyb20gJy4vZW50cnknO1xuaW1wb3J0IHtcbiAgRGlyRW50cnksXG4gIEZpbGVFbnRyeSxcbiAgRmlsZVByZWRpY2F0ZSxcbiAgRmlsZVZpc2l0b3IsXG4gIEZpbGVWaXNpdG9yQ2FuY2VsVG9rZW4sXG4gIE1lcmdlU3RyYXRlZ3ksXG4gIFRyZWUsXG4gIFRyZWVTeW1ib2wsXG4gIFVwZGF0ZVJlY29yZGVyLFxufSBmcm9tICcuL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBVcGRhdGVSZWNvcmRlckJhc2UgfSBmcm9tICcuL3JlY29yZGVyJztcblxuXG5sZXQgX3VuaXF1ZUlkID0gMDtcblxuXG5leHBvcnQgY2xhc3MgSG9zdERpckVudHJ5IGltcGxlbWVudHMgRGlyRW50cnkge1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBwYXJlbnQ6IERpckVudHJ5IHwgbnVsbCxcbiAgICByZWFkb25seSBwYXRoOiBQYXRoLFxuICAgIHByb3RlY3RlZCBfaG9zdDogdmlydHVhbEZzLlN5bmNEZWxlZ2F0ZUhvc3QsXG4gICAgcHJvdGVjdGVkIF90cmVlOiBUcmVlLFxuICApIHt9XG5cbiAgZ2V0IHN1YmRpcnMoKTogUGF0aEZyYWdtZW50W10ge1xuICAgIHJldHVybiB0aGlzLl9ob3N0Lmxpc3QodGhpcy5wYXRoKVxuICAgICAgLmZpbHRlcihmcmFnbWVudCA9PiB0aGlzLl9ob3N0LmlzRGlyZWN0b3J5KGpvaW4odGhpcy5wYXRoLCBmcmFnbWVudCkpKTtcbiAgfVxuICBnZXQgc3ViZmlsZXMoKTogUGF0aEZyYWdtZW50W10ge1xuICAgIHJldHVybiB0aGlzLl9ob3N0Lmxpc3QodGhpcy5wYXRoKVxuICAgICAgLmZpbHRlcihmcmFnbWVudCA9PiB0aGlzLl9ob3N0LmlzRmlsZShqb2luKHRoaXMucGF0aCwgZnJhZ21lbnQpKSk7XG4gIH1cblxuICBkaXIobmFtZTogUGF0aEZyYWdtZW50KTogRGlyRW50cnkge1xuICAgIHJldHVybiB0aGlzLl90cmVlLmdldERpcihqb2luKHRoaXMucGF0aCwgbmFtZSkpO1xuICB9XG4gIGZpbGUobmFtZTogUGF0aEZyYWdtZW50KTogRmlsZUVudHJ5IHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3RyZWUuZ2V0KGpvaW4odGhpcy5wYXRoLCBuYW1lKSk7XG4gIH1cblxuICB2aXNpdCh2aXNpdG9yOiBGaWxlVmlzaXRvcik6IHZvaWQge1xuICAgIGZ1bmN0aW9uIF9yZWN1cnNlKGVudHJ5OiBEaXJFbnRyeSkge1xuICAgICAgZW50cnkuc3ViZmlsZXMuZm9yRWFjaChwYXRoID0+IHtcbiAgICAgICAgdmlzaXRvcihqb2luKGVudHJ5LnBhdGgsIHBhdGgpLCBlbnRyeS5maWxlKHBhdGgpKTtcbiAgICAgIH0pO1xuICAgICAgZW50cnkuc3ViZGlycy5mb3JFYWNoKHBhdGggPT4ge1xuICAgICAgICBfcmVjdXJzZShlbnRyeS5kaXIocGF0aCkpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIF9yZWN1cnNlKHRoaXMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlICE9PSBGaWxlVmlzaXRvckNhbmNlbFRva2VuKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIEhvc3RUcmVlIGltcGxlbWVudHMgVHJlZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2lkID0gLS1fdW5pcXVlSWQ7XG4gIHByaXZhdGUgX3JlY29yZDogdmlydHVhbEZzLkNvcmRIb3N0O1xuICBwcml2YXRlIF9yZWNvcmRTeW5jOiB2aXJ0dWFsRnMuU3luY0RlbGVnYXRlSG9zdDtcbiAgcHJpdmF0ZSBfYW5jZXN0cnkgPSBuZXcgU2V0PG51bWJlcj4oKTtcblxuICBwcml2YXRlIF9kaXJDYWNoZSA9IG5ldyBNYXA8UGF0aCwgSG9zdERpckVudHJ5PigpO1xuXG5cbiAgW1RyZWVTeW1ib2xdKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RhdGljIGlzSG9zdFRyZWUodHJlZTogVHJlZSk6IHRyZWUgaXMgSG9zdFRyZWUge1xuICAgIGlmICh0cmVlIGluc3RhbmNlb2YgSG9zdFRyZWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdHJlZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mICh0cmVlIGFzIEhvc3RUcmVlKS5fYW5jZXN0cnkgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX2JhY2tlbmQ6IHZpcnR1YWxGcy5SZWFkb25seUhvc3Q8e30+ID0gbmV3IHZpcnR1YWxGcy5FbXB0eSgpKSB7XG4gICAgdGhpcy5fcmVjb3JkID0gbmV3IHZpcnR1YWxGcy5Db3JkSG9zdChuZXcgdmlydHVhbEZzLlNhZmVSZWFkb25seUhvc3QoX2JhY2tlbmQpKTtcbiAgICB0aGlzLl9yZWNvcmRTeW5jID0gbmV3IHZpcnR1YWxGcy5TeW5jRGVsZWdhdGVIb3N0KHRoaXMuX3JlY29yZCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25vcm1hbGl6ZVBhdGgocGF0aDogc3RyaW5nKTogUGF0aCB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZSgnLycgKyBwYXRoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfd2lsbENyZWF0ZShwYXRoOiBQYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlY29yZC53aWxsQ3JlYXRlKHBhdGgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF93aWxsT3ZlcndyaXRlKHBhdGg6IFBhdGgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVjb3JkLndpbGxPdmVyd3JpdGUocGF0aCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3dpbGxEZWxldGUocGF0aDogUGF0aCkge1xuICAgIHJldHVybiB0aGlzLl9yZWNvcmQud2lsbERlbGV0ZShwYXRoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfd2lsbFJlbmFtZShwYXRoOiBQYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlY29yZC53aWxsUmVuYW1lKHBhdGgpO1xuICB9XG5cbiAgLy8gVGhpcyBjYW4gYmUgdXNlZCBieSBvbGQgU2NoZW1hdGljcyBsaWJyYXJ5IHdpdGggbmV3IFRyZWVzIGluIHNvbWUgY29ybmVyIGNhc2VzLlxuICAvLyBUT0RPOiByZW1vdmUgdGhpcyBmb3IgNy4wXG4gIG9wdGltaXplKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYnJhbmNoKCk6IFRyZWUge1xuICAgIGNvbnN0IGJyYW5jaGVkVHJlZSA9IG5ldyBIb3N0VHJlZSh0aGlzLl9iYWNrZW5kKTtcbiAgICBicmFuY2hlZFRyZWUuX3JlY29yZCA9IHRoaXMuX3JlY29yZC5jbG9uZSgpO1xuICAgIGJyYW5jaGVkVHJlZS5fcmVjb3JkU3luYyA9IG5ldyB2aXJ0dWFsRnMuU3luY0RlbGVnYXRlSG9zdChicmFuY2hlZFRyZWUuX3JlY29yZCk7XG4gICAgYnJhbmNoZWRUcmVlLl9hbmNlc3RyeSA9IG5ldyBTZXQodGhpcy5fYW5jZXN0cnkpLmFkZCh0aGlzLl9pZCk7XG5cbiAgICByZXR1cm4gYnJhbmNoZWRUcmVlO1xuICB9XG5cbiAgbWVyZ2Uob3RoZXI6IFRyZWUsIHN0cmF0ZWd5OiBNZXJnZVN0cmF0ZWd5ID0gTWVyZ2VTdHJhdGVneS5EZWZhdWx0KTogdm9pZCB7XG4gICAgaWYgKG90aGVyID09PSB0aGlzKSB7XG4gICAgICAvLyBNZXJnaW5nIHdpdGggeW91cnNlbGY/IFRzayB0c2suIE5vdGhpbmcgdG8gZG8gYXQgbGVhc3QuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG90aGVyIGluc3RhbmNlb2YgSG9zdFRyZWUgJiYgb3RoZXIuX2FuY2VzdHJ5Lmhhcyh0aGlzLl9pZCkpIHtcbiAgICAgIC8vIFdvcmthcm91bmQgZm9yIG1lcmdpbmcgYSBicmFuY2ggYmFjayBpbnRvIG9uZSBvZiBpdHMgYW5jZXN0b3JzXG4gICAgICAvLyBNb3JlIGNvbXBsZXRlIGJyYW5jaCBwb2ludCB0cmFja2luZyBpcyByZXF1aXJlZCB0byBhdm9pZFxuICAgICAgc3RyYXRlZ3kgfD0gTWVyZ2VTdHJhdGVneS5PdmVyd3JpdGU7XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRpb25Db25mbGljdEFsbG93ZWQgPVxuICAgICAgKHN0cmF0ZWd5ICYgTWVyZ2VTdHJhdGVneS5BbGxvd0NyZWF0aW9uQ29uZmxpY3QpID09IE1lcmdlU3RyYXRlZ3kuQWxsb3dDcmVhdGlvbkNvbmZsaWN0O1xuICAgIGNvbnN0IG92ZXJ3cml0ZUNvbmZsaWN0QWxsb3dlZCA9XG4gICAgICAoc3RyYXRlZ3kgJiBNZXJnZVN0cmF0ZWd5LkFsbG93T3ZlcndyaXRlQ29uZmxpY3QpID09IE1lcmdlU3RyYXRlZ3kuQWxsb3dPdmVyd3JpdGVDb25mbGljdDtcbiAgICBjb25zdCBkZWxldGVDb25mbGljdEFsbG93ZWQgPVxuICAgICAgKHN0cmF0ZWd5ICYgTWVyZ2VTdHJhdGVneS5BbGxvd092ZXJ3cml0ZUNvbmZsaWN0KSA9PSBNZXJnZVN0cmF0ZWd5LkFsbG93RGVsZXRlQ29uZmxpY3Q7XG5cbiAgICBvdGhlci5hY3Rpb25zLmZvckVhY2goYWN0aW9uID0+IHtcbiAgICAgIHN3aXRjaCAoYWN0aW9uLmtpbmQpIHtcbiAgICAgICAgY2FzZSAnYyc6IHtcbiAgICAgICAgICBjb25zdCB7IHBhdGgsIGNvbnRlbnQgfSA9IGFjdGlvbjtcblxuICAgICAgICAgIGlmICgodGhpcy5fd2lsbENyZWF0ZShwYXRoKSB8fCB0aGlzLl93aWxsT3ZlcndyaXRlKHBhdGgpKSkge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdDb250ZW50ID0gdGhpcy5yZWFkKHBhdGgpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nQ29udGVudCAmJiBjb250ZW50LmVxdWFscyhleGlzdGluZ0NvbnRlbnQpKSB7XG4gICAgICAgICAgICAgIC8vIElkZW50aWNhbCBvdXRjb21lOyBubyBhY3Rpb24gcmVxdWlyZWRcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWNyZWF0aW9uQ29uZmxpY3RBbGxvd2VkKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXJnZUNvbmZsaWN0RXhjZXB0aW9uKHBhdGgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9yZWNvcmQub3ZlcndyaXRlKHBhdGgsIGNvbnRlbnQgYXMge30gYXMgdmlydHVhbEZzLkZpbGVCdWZmZXIpLnN1YnNjcmliZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9yZWNvcmQuY3JlYXRlKHBhdGgsIGNvbnRlbnQgYXMge30gYXMgdmlydHVhbEZzLkZpbGVCdWZmZXIpLnN1YnNjcmliZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgJ28nOiB7XG4gICAgICAgICAgY29uc3QgeyBwYXRoLCBjb250ZW50IH0gPSBhY3Rpb247XG4gICAgICAgICAgaWYgKHRoaXMuX3dpbGxEZWxldGUocGF0aCkgJiYgIW92ZXJ3cml0ZUNvbmZsaWN0QWxsb3dlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1lcmdlQ29uZmxpY3RFeGNlcHRpb24ocGF0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWdub3JlIGlmIGNvbnRlbnQgaXMgdGhlIHNhbWUgKGNvbnNpZGVyZWQgdGhlIHNhbWUgY2hhbmdlKS5cbiAgICAgICAgICBpZiAodGhpcy5fd2lsbE92ZXJ3cml0ZShwYXRoKSkge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdDb250ZW50ID0gdGhpcy5yZWFkKHBhdGgpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nQ29udGVudCAmJiBjb250ZW50LmVxdWFscyhleGlzdGluZ0NvbnRlbnQpKSB7XG4gICAgICAgICAgICAgIC8vIElkZW50aWNhbCBvdXRjb21lOyBubyBhY3Rpb24gcmVxdWlyZWRcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW92ZXJ3cml0ZUNvbmZsaWN0QWxsb3dlZCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWVyZ2VDb25mbGljdEV4Y2VwdGlvbihwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gV2UgdXNlIHdyaXRlIGhlcmUgYXMgbWVyZ2UgdmFsaWRhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIGRvbmUsIGFuZCB3ZSB3YW50IHRvIGxldFxuICAgICAgICAgIC8vIHRoZSBDb3JkSG9zdCBkbyBpdHMgam9iLlxuICAgICAgICAgIHRoaXMuX3JlY29yZC53cml0ZShwYXRoLCBjb250ZW50IGFzIHt9IGFzIHZpcnR1YWxGcy5GaWxlQnVmZmVyKS5zdWJzY3JpYmUoKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgJ3InOiB7XG4gICAgICAgICAgY29uc3QgeyBwYXRoLCB0byB9ID0gYWN0aW9uO1xuICAgICAgICAgIGlmICh0aGlzLl93aWxsRGVsZXRlKHBhdGgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWVyZ2VDb25mbGljdEV4Y2VwdGlvbihwYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5fd2lsbFJlbmFtZShwYXRoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3JlY29yZC53aWxsUmVuYW1lVG8ocGF0aCwgdG8pKSB7XG4gICAgICAgICAgICAgIC8vIElkZW50aWNhbCBvdXRjb21lOyBubyBhY3Rpb24gcmVxdWlyZWRcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBObyBvdmVycmlkZSBwb3NzaWJsZSBmb3IgcmVuYW1pbmcuXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWVyZ2VDb25mbGljdEV4Y2VwdGlvbihwYXRoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5yZW5hbWUocGF0aCwgdG8pO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSAnZCc6IHtcbiAgICAgICAgICBjb25zdCB7IHBhdGggfSA9IGFjdGlvbjtcbiAgICAgICAgICBpZiAodGhpcy5fd2lsbERlbGV0ZShwYXRoKSkge1xuICAgICAgICAgICAgLy8gVE9ETzogVGhpcyBzaG91bGQgdGVjaG5pY2FsbHkgY2hlY2sgdGhlIGNvbnRlbnQgKGUuZy4sIGhhc2ggb24gZGVsZXRlKVxuICAgICAgICAgICAgLy8gSWRlbnRpY2FsIG91dGNvbWU7IG5vIGFjdGlvbiByZXF1aXJlZFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghdGhpcy5leGlzdHMocGF0aCkgJiYgIWRlbGV0ZUNvbmZsaWN0QWxsb3dlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1lcmdlQ29uZmxpY3RFeGNlcHRpb24ocGF0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fcmVjb3JkU3luYy5kZWxldGUocGF0aCk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldCByb290KCk6IERpckVudHJ5IHtcbiAgICByZXR1cm4gdGhpcy5nZXREaXIoJy8nKTtcbiAgfVxuXG4gIC8vIFJlYWRvbmx5LlxuICByZWFkKHBhdGg6IHN0cmluZyk6IEJ1ZmZlciB8IG51bGwge1xuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5nZXQocGF0aCk7XG5cbiAgICByZXR1cm4gZW50cnkgPyBlbnRyeS5jb250ZW50IDogbnVsbDtcbiAgfVxuICBleGlzdHMocGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlY29yZFN5bmMuaXNGaWxlKHRoaXMuX25vcm1hbGl6ZVBhdGgocGF0aCkpO1xuICB9XG5cbiAgZ2V0KHBhdGg6IHN0cmluZyk6IEZpbGVFbnRyeSB8IG51bGwge1xuICAgIGNvbnN0IHAgPSB0aGlzLl9ub3JtYWxpemVQYXRoKHBhdGgpO1xuICAgIGlmICh0aGlzLl9yZWNvcmRTeW5jLmlzRGlyZWN0b3J5KHApKSB7XG4gICAgICB0aHJvdyBuZXcgUGF0aElzRGlyZWN0b3J5RXhjZXB0aW9uKHApO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX3JlY29yZFN5bmMuZXhpc3RzKHApKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IExhenlGaWxlRW50cnkocCwgKCkgPT4gQnVmZmVyLmZyb20odGhpcy5fcmVjb3JkU3luYy5yZWFkKHApKSk7XG4gIH1cblxuICBnZXREaXIocGF0aDogc3RyaW5nKTogRGlyRW50cnkge1xuICAgIGNvbnN0IHAgPSB0aGlzLl9ub3JtYWxpemVQYXRoKHBhdGgpO1xuICAgIGlmICh0aGlzLl9yZWNvcmRTeW5jLmlzRmlsZShwKSkge1xuICAgICAgdGhyb3cgbmV3IFBhdGhJc0ZpbGVFeGNlcHRpb24ocCk7XG4gICAgfVxuXG4gICAgbGV0IG1heWJlQ2FjaGUgPSB0aGlzLl9kaXJDYWNoZS5nZXQocCk7XG4gICAgaWYgKCFtYXliZUNhY2hlKSB7XG4gICAgICBsZXQgcGFyZW50OiBQYXRoIHwgbnVsbCA9IGRpcm5hbWUocCk7XG4gICAgICBpZiAocCA9PT0gcGFyZW50KSB7XG4gICAgICAgIHBhcmVudCA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIG1heWJlQ2FjaGUgPSBuZXcgSG9zdERpckVudHJ5KHBhcmVudCAmJiB0aGlzLmdldERpcihwYXJlbnQpLCBwLCB0aGlzLl9yZWNvcmRTeW5jLCB0aGlzKTtcbiAgICAgIHRoaXMuX2RpckNhY2hlLnNldChwLCBtYXliZUNhY2hlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWF5YmVDYWNoZTtcbiAgfVxuICB2aXNpdCh2aXNpdG9yOiBGaWxlVmlzaXRvcik6IHZvaWQge1xuICAgIGNvbnN0IGFsbEZpbGVzOiBbUGF0aCwgRmlsZUVudHJ5IHwgbnVsbCB8IHVuZGVmaW5lZF1bXSA9IFtdO1xuICAgIHRoaXMucm9vdC52aXNpdCgocGF0aCwgZW50cnkpID0+IHtcbiAgICAgIGFsbEZpbGVzLnB1c2goW3BhdGgsIGVudHJ5XSk7XG4gICAgfSk7XG5cbiAgICBhbGxGaWxlcy5mb3JFYWNoKChbcGF0aCwgZW50cnldKSA9PiB2aXNpdG9yKHBhdGgsIGVudHJ5KSk7XG4gIH1cblxuICAvLyBDaGFuZ2UgY29udGVudCBvZiBob3N0IGZpbGVzLlxuICBvdmVyd3JpdGUocGF0aDogc3RyaW5nLCBjb250ZW50OiBCdWZmZXIgfCBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwID0gdGhpcy5fbm9ybWFsaXplUGF0aChwYXRoKTtcbiAgICBpZiAoIXRoaXMuX3JlY29yZFN5bmMuZXhpc3RzKHApKSB7XG4gICAgICB0aHJvdyBuZXcgRmlsZURvZXNOb3RFeGlzdEV4Y2VwdGlvbihwKTtcbiAgICB9XG4gICAgY29uc3QgYyA9IHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gQnVmZmVyLmZyb20oY29udGVudCkgOiBjb250ZW50O1xuICAgIHRoaXMuX3JlY29yZC5vdmVyd3JpdGUocCwgYyBhcyB7fSBhcyB2aXJ0dWFsRnMuRmlsZUJ1ZmZlcikuc3Vic2NyaWJlKCk7XG4gIH1cbiAgYmVnaW5VcGRhdGUocGF0aDogc3RyaW5nKTogVXBkYXRlUmVjb3JkZXIge1xuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5nZXQocGF0aCk7XG4gICAgaWYgKCFlbnRyeSkge1xuICAgICAgdGhyb3cgbmV3IEZpbGVEb2VzTm90RXhpc3RFeGNlcHRpb24ocGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFVwZGF0ZVJlY29yZGVyQmFzZS5jcmVhdGVGcm9tRmlsZUVudHJ5KGVudHJ5KTtcbiAgfVxuICBjb21taXRVcGRhdGUocmVjb3JkOiBVcGRhdGVSZWNvcmRlcik6IHZvaWQge1xuICAgIGlmIChyZWNvcmQgaW5zdGFuY2VvZiBVcGRhdGVSZWNvcmRlckJhc2UpIHtcbiAgICAgIGNvbnN0IHBhdGggPSByZWNvcmQucGF0aDtcbiAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5nZXQocGF0aCk7XG4gICAgICBpZiAoIWVudHJ5KSB7XG4gICAgICAgIHRocm93IG5ldyBDb250ZW50SGFzTXV0YXRlZEV4Y2VwdGlvbihwYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG5ld0NvbnRlbnQgPSByZWNvcmQuYXBwbHkoZW50cnkuY29udGVudCk7XG4gICAgICAgIHRoaXMub3ZlcndyaXRlKHBhdGgsIG5ld0NvbnRlbnQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZFVwZGF0ZVJlY29yZEV4Y2VwdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFN0cnVjdHVyYWwgbWV0aG9kcy5cbiAgY3JlYXRlKHBhdGg6IHN0cmluZywgY29udGVudDogQnVmZmVyIHwgc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgcCA9IHRoaXMuX25vcm1hbGl6ZVBhdGgocGF0aCk7XG4gICAgaWYgKHRoaXMuX3JlY29yZFN5bmMuZXhpc3RzKHApKSB7XG4gICAgICB0aHJvdyBuZXcgRmlsZUFscmVhZHlFeGlzdEV4Y2VwdGlvbihwKTtcbiAgICB9XG4gICAgY29uc3QgYyA9IHR5cGVvZiBjb250ZW50ID09ICdzdHJpbmcnID8gQnVmZmVyLmZyb20oY29udGVudCkgOiBjb250ZW50O1xuICAgIHRoaXMuX3JlY29yZC5jcmVhdGUocCwgYyBhcyB7fSBhcyB2aXJ0dWFsRnMuRmlsZUJ1ZmZlcikuc3Vic2NyaWJlKCk7XG4gIH1cbiAgZGVsZXRlKHBhdGg6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX3JlY29yZFN5bmMuZGVsZXRlKHRoaXMuX25vcm1hbGl6ZVBhdGgocGF0aCkpO1xuICB9XG4gIHJlbmFtZShmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9yZWNvcmRTeW5jLnJlbmFtZSh0aGlzLl9ub3JtYWxpemVQYXRoKGZyb20pLCB0aGlzLl9ub3JtYWxpemVQYXRoKHRvKSk7XG4gIH1cblxuICBhcHBseShhY3Rpb246IEFjdGlvbiwgc3RyYXRlZ3k/OiBNZXJnZVN0cmF0ZWd5KTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ0FwcGx5IG5vdCBpbXBsZW1lbnRlZCBvbiBob3N0IHRyZWVzLicpO1xuICB9XG4gIGdldCBhY3Rpb25zKCk6IEFjdGlvbltdIHtcbiAgICAvLyBDcmVhdGUgYSBsaXN0IG9mIGFsbCByZWNvcmRzIHVudGlsIHdlIGhpdCBvdXIgb3JpZ2luYWwgYmFja2VuZC4gVGhpcyBpcyB0byBzdXBwb3J0IGJyYW5jaGVzXG4gICAgLy8gdGhhdCBkaXZlcmdlIGZyb20gZWFjaCBvdGhlcnMuXG4gICAgY29uc3QgYWxsUmVjb3JkcyA9IFsuLi50aGlzLl9yZWNvcmQucmVjb3JkcygpXTtcblxuICAgIHJldHVybiBjbGVhbihcbiAgICAgIGFsbFJlY29yZHNcbiAgICAgICAgLm1hcChyZWNvcmQgPT4ge1xuICAgICAgICAgIHN3aXRjaCAocmVjb3JkLmtpbmQpIHtcbiAgICAgICAgICAgIGNhc2UgJ2NyZWF0ZSc6XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMuX2lkLFxuICAgICAgICAgICAgICAgIHBhcmVudDogMCxcbiAgICAgICAgICAgICAgICBraW5kOiAnYycsXG4gICAgICAgICAgICAgICAgcGF0aDogcmVjb3JkLnBhdGgsXG4gICAgICAgICAgICAgICAgY29udGVudDogQnVmZmVyLmZyb20ocmVjb3JkLmNvbnRlbnQpLFxuICAgICAgICAgICAgICB9IGFzIENyZWF0ZUZpbGVBY3Rpb247XG4gICAgICAgICAgICBjYXNlICdvdmVyd3JpdGUnOlxuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLl9pZCxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IDAsXG4gICAgICAgICAgICAgICAga2luZDogJ28nLFxuICAgICAgICAgICAgICAgIHBhdGg6IHJlY29yZC5wYXRoLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IEJ1ZmZlci5mcm9tKHJlY29yZC5jb250ZW50KSxcbiAgICAgICAgICAgICAgfSBhcyBPdmVyd3JpdGVGaWxlQWN0aW9uO1xuICAgICAgICAgICAgY2FzZSAncmVuYW1lJzpcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5faWQsXG4gICAgICAgICAgICAgICAgcGFyZW50OiAwLFxuICAgICAgICAgICAgICAgIGtpbmQ6ICdyJyxcbiAgICAgICAgICAgICAgICBwYXRoOiByZWNvcmQuZnJvbSxcbiAgICAgICAgICAgICAgICB0bzogcmVjb3JkLnRvLFxuICAgICAgICAgICAgICB9IGFzIFJlbmFtZUZpbGVBY3Rpb247XG4gICAgICAgICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLl9pZCxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IDAsXG4gICAgICAgICAgICAgICAga2luZDogJ2QnLFxuICAgICAgICAgICAgICAgIHBhdGg6IHJlY29yZC5wYXRoLFxuICAgICAgICAgICAgICB9IGFzIERlbGV0ZUZpbGVBY3Rpb247XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEhvc3RDcmVhdGVUcmVlIGV4dGVuZHMgSG9zdFRyZWUge1xuICBjb25zdHJ1Y3Rvcihob3N0OiB2aXJ0dWFsRnMuUmVhZG9ubHlIb3N0KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGNvbnN0IHRlbXBIb3N0ID0gbmV3IEhvc3RUcmVlKGhvc3QpO1xuICAgIHRlbXBIb3N0LnZpc2l0KHBhdGggPT4ge1xuICAgICAgY29uc3QgY29udGVudCA9IHRlbXBIb3N0LnJlYWQocGF0aCk7XG4gICAgICBpZiAoY29udGVudCkge1xuICAgICAgICB0aGlzLmNyZWF0ZShwYXRoLCBjb250ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRmlsdGVySG9zdFRyZWUgZXh0ZW5kcyBIb3N0VHJlZSB7XG4gIGNvbnN0cnVjdG9yKHRyZWU6IEhvc3RUcmVlLCBmaWx0ZXI6IEZpbGVQcmVkaWNhdGU8Ym9vbGVhbj4gPSAoKSA9PiB0cnVlKSB7XG4gICAgY29uc3QgbmV3QmFja2VuZCA9IG5ldyB2aXJ0dWFsRnMuU2ltcGxlTWVtb3J5SG9zdCgpO1xuICAgIC8vIGNhc3QgdG8gYWxsb3cgYWNjZXNzXG4gICAgY29uc3Qgb3JpZ2luYWxCYWNrZW5kID0gKHRyZWUgYXMgRmlsdGVySG9zdFRyZWUpLl9iYWNrZW5kO1xuXG4gICAgY29uc3QgcmVjdXJzZTogKGJhc2U6IFBhdGgpID0+IE9ic2VydmFibGU8dm9pZD4gPSBiYXNlID0+IHtcbiAgICAgIHJldHVybiBvcmlnaW5hbEJhY2tlbmQubGlzdChiYXNlKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICBtZXJnZU1hcCh4ID0+IHgpLFxuICAgICAgICAgIG1hcChwYXRoID0+IGpvaW4oYmFzZSwgcGF0aCkpLFxuICAgICAgICAgIGNvbmNhdE1hcChwYXRoID0+IHtcbiAgICAgICAgICAgIGxldCBpc0RpcmVjdG9yeSA9IGZhbHNlO1xuICAgICAgICAgICAgb3JpZ2luYWxCYWNrZW5kLmlzRGlyZWN0b3J5KHBhdGgpLnN1YnNjcmliZSh2YWwgPT4gaXNEaXJlY3RvcnkgPSB2YWwpO1xuICAgICAgICAgICAgaWYgKGlzRGlyZWN0b3J5KSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWN1cnNlKHBhdGgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaXNGaWxlID0gZmFsc2U7XG4gICAgICAgICAgICBvcmlnaW5hbEJhY2tlbmQuaXNGaWxlKHBhdGgpLnN1YnNjcmliZSh2YWwgPT4gaXNGaWxlID0gdmFsKTtcbiAgICAgICAgICAgIGlmICghaXNGaWxlIHx8ICFmaWx0ZXIocGF0aCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG9mKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjb250ZW50OiBBcnJheUJ1ZmZlciB8IG51bGwgPSBudWxsO1xuICAgICAgICAgICAgb3JpZ2luYWxCYWNrZW5kLnJlYWQocGF0aCkuc3Vic2NyaWJlKHZhbCA9PiBjb250ZW50ID0gdmFsKTtcbiAgICAgICAgICAgIGlmICghY29udGVudCkge1xuICAgICAgICAgICAgICByZXR1cm4gb2YoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ld0JhY2tlbmQud3JpdGUocGF0aCwgY29udGVudCBhcyB7fSBhcyB2aXJ0dWFsRnMuRmlsZUJ1ZmZlcik7XG4gICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHJlY3Vyc2Uobm9ybWFsaXplKCcvJykpLnN1YnNjcmliZSgpO1xuXG4gICAgc3VwZXIobmV3QmFja2VuZCk7XG5cbiAgICBmb3IgKGNvbnN0IGFjdGlvbiBvZiB0cmVlLmFjdGlvbnMpIHtcbiAgICAgIGlmICghZmlsdGVyKGFjdGlvbi5wYXRoKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgc3dpdGNoIChhY3Rpb24ua2luZCkge1xuICAgICAgICBjYXNlICdjJzpcbiAgICAgICAgICB0aGlzLmNyZWF0ZShhY3Rpb24ucGF0aCwgYWN0aW9uLmNvbnRlbnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICB0aGlzLmRlbGV0ZShhY3Rpb24ucGF0aCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ28nOlxuICAgICAgICAgIHRoaXMub3ZlcndyaXRlKGFjdGlvbi5wYXRoLCBhY3Rpb24uY29udGVudCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3InOlxuICAgICAgICAgIHRoaXMucmVuYW1lKGFjdGlvbi5wYXRoLCBhY3Rpb24udG8pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19