"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const node_1 = require("@angular-devkit/core/node");
const fs = require("fs");
const path = require("path");
const rxjs_1 = require("rxjs");
function _loadConfiguration(Configuration, options, root, file) {
    if (options.tslintConfig) {
        return Configuration.parseConfigFile(options.tslintConfig, root);
    }
    else if (options.tslintPath) {
        return Configuration.findConfiguration(path.join(root, options.tslintPath)).results;
    }
    else if (file) {
        return Configuration.findConfiguration(null, file).results;
    }
    else {
        throw new Error('Executor must specify a tslint configuration.');
    }
}
function _getFileContent(file, options, program) {
    // The linter retrieves the SourceFile TS node directly if a program is used
    if (program) {
        const source = program.getSourceFile(file);
        if (!source) {
            const message = `File '${file}' is not part of the TypeScript project '${options.tsConfigPath}'.`;
            throw new Error(message);
        }
        return source.getFullText(source);
    }
    // NOTE: The tslint CLI checks for and excludes MPEG transport streams; this does not.
    try {
        // Strip BOM from file data.
        // https://stackoverflow.com/questions/24356713
        return fs.readFileSync(file, 'utf-8').replace(/^\uFEFF/, '');
    }
    catch (_a) {
        throw new Error(`Could not read file '${file}'.`);
    }
}
function _listAllFiles(root) {
    const result = [];
    function _recurse(location) {
        const dir = fs.readdirSync(path.join(root, location));
        dir.forEach(name => {
            const loc = path.join(location, name);
            if (fs.statSync(path.join(root, loc)).isDirectory()) {
                _recurse(loc);
            }
            else {
                result.push(loc);
            }
        });
    }
    _recurse('');
    return result;
}
function default_1() {
    return (options, context) => {
        return new rxjs_1.Observable(obs => {
            const root = process.cwd();
            const tslint = require(node_1.resolve('tslint', {
                basedir: root,
                checkGlobal: true,
                checkLocal: true,
            }));
            const includes = (Array.isArray(options.includes)
                ? options.includes
                : (options.includes ? [options.includes] : []));
            const files = (Array.isArray(options.files)
                ? options.files
                : (options.files ? [options.files] : []));
            const Linter = tslint.Linter;
            const Configuration = tslint.Configuration;
            let program = undefined;
            let filesToLint = files;
            if (options.tsConfigPath && files.length == 0) {
                const tsConfigPath = path.join(process.cwd(), options.tsConfigPath);
                if (!fs.existsSync(tsConfigPath)) {
                    obs.error(new Error('Could not find tsconfig.'));
                    return;
                }
                program = Linter.createProgram(tsConfigPath);
                filesToLint = Linter.getFileNames(program);
            }
            if (includes.length > 0) {
                const allFilesRel = _listAllFiles(root);
                const pattern = '^('
                    + includes
                        .map(ex => '('
                        + ex.split(/[\/\\]/g).map(f => f
                            .replace(/[\-\[\]{}()+?.^$|]/g, '\\$&')
                            .replace(/^\*\*/g, '(.+?)?')
                            .replace(/\*/g, '[^/\\\\]*'))
                            .join('[\/\\\\]')
                        + ')')
                        .join('|')
                    + ')($|/|\\\\)';
                const re = new RegExp(pattern);
                filesToLint.push(...allFilesRel
                    .filter(x => re.test(x))
                    .map(x => path.join(root, x)));
            }
            const lintOptions = {
                fix: true,
                formatter: options.format || 'prose',
            };
            const linter = new Linter(lintOptions, program);
            // If directory doesn't change, we
            let lastDirectory = null;
            let config;
            for (const file of filesToLint) {
                const dir = path.dirname(file);
                if (lastDirectory !== dir) {
                    lastDirectory = dir;
                    config = _loadConfiguration(Configuration, options, root, file);
                }
                const content = _getFileContent(file, options, program);
                if (!content) {
                    continue;
                }
                linter.lint(file, content, config);
            }
            const result = linter.getResult();
            // Format and show the results.
            if (!options.silent) {
                const Formatter = tslint.findFormatter(options.format || 'prose');
                if (!Formatter) {
                    throw new Error(`Invalid lint format "${options.format}".`);
                }
                const formatter = new Formatter();
                const output = formatter.format(result.failures, result.fixes);
                if (output) {
                    context.logger.info(output);
                }
            }
            if (!options.ignoreErrors && result.errorCount > 0) {
                obs.error(new Error('Lint errors were found.'));
            }
            else {
                obs.next();
                obs.complete();
            }
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0b3IuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MvdHNsaW50LWZpeC9leGVjdXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILG9EQUFvRDtBQUNwRCx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLCtCQUFrQztBQWNsQyxTQUFTLGtCQUFrQixDQUN6QixhQUE2QixFQUM3QixPQUE2QixFQUM3QixJQUFZLEVBQ1osSUFBYTtJQUViLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRTtRQUN4QixPQUFPLGFBQWEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNsRTtTQUFNLElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRTtRQUM3QixPQUFPLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7S0FDckY7U0FBTSxJQUFJLElBQUksRUFBRTtRQUNmLE9BQU8sYUFBYSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUM7S0FDNUQ7U0FBTTtRQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztLQUNsRTtBQUNILENBQUM7QUFHRCxTQUFTLGVBQWUsQ0FDdEIsSUFBWSxFQUNaLE9BQTZCLEVBQzdCLE9BQW9CO0lBRXBCLDRFQUE0RTtJQUM1RSxJQUFJLE9BQU8sRUFBRTtRQUNYLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE1BQU0sT0FBTyxHQUNULFNBQVMsSUFBSSw0Q0FBNEMsT0FBTyxDQUFDLFlBQVksSUFB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LE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQztnQkFDbEUsSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztpQkFDN0Q7Z0JBQ0QsTUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFFbEMsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDL0QsSUFBSSxNQUFNLEVBQUU7b0JBQ1YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQzdCO2FBQ0Y7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksSUFBSSxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTtnQkFDbEQsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7YUFDakQ7aUJBQU07Z0JBQ0wsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNYLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNoQjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQTNHRCw0QkEyR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUvbm9kZSc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgQ29uZmlndXJhdGlvbiBhcyBDb25maWd1cmF0aW9uTlMsXG4gIExpbnRlciBhcyBMaW50ZXJOUyxcbn0gZnJvbSAndHNsaW50JzsgIC8vIHRzbGludDpkaXNhYmxlLWxpbmU6bm8taW1wbGljaXQtZGVwZW5kZW5jaWVzXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JzsgIC8vIHRzbGludDpkaXNhYmxlLWxpbmU6bm8taW1wbGljaXQtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBTY2hlbWF0aWNDb250ZXh0LCBUYXNrRXhlY3V0b3IgfSBmcm9tICcuLi8uLi9zcmMnO1xuaW1wb3J0IHsgVHNsaW50Rml4VGFza09wdGlvbnMgfSBmcm9tICcuL29wdGlvbnMnO1xuXG5cbnR5cGUgQ29uZmlndXJhdGlvblQgPSB0eXBlb2YgQ29uZmlndXJhdGlvbk5TO1xudHlwZSBMaW50ZXJUID0gdHlwZW9mIExpbnRlck5TO1xuXG5cbmZ1bmN0aW9uIF9sb2FkQ29uZmlndXJhdGlvbihcbiAgQ29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvblQsXG4gIG9wdGlvbnM6IFRzbGludEZpeFRhc2tPcHRpb25zLFxuICByb290OiBzdHJpbmcsXG4gIGZpbGU/OiBzdHJpbmcsXG4pIHtcbiAgaWYgKG9wdGlvbnMudHNsaW50Q29uZmlnKSB7XG4gICAgcmV0dXJuIENvbmZpZ3VyYXRpb24ucGFyc2VDb25maWdGaWxlKG9wdGlvbnMudHNsaW50Q29uZmlnLCByb290KTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLnRzbGludFBhdGgpIHtcbiAgICByZXR1cm4gQ29uZmlndXJhdGlvbi5maW5kQ29uZmlndXJhdGlvbihwYXRoLmpvaW4ocm9vdCwgb3B0aW9ucy50c2xpbnRQYXRoKSkucmVzdWx0cztcbiAgfSBlbHNlIGlmIChmaWxlKSB7XG4gICAgcmV0dXJuIENvbmZpZ3VyYXRpb24uZmluZENvbmZpZ3VyYXRpb24obnVsbCwgZmlsZSkucmVzdWx0cztcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4ZWN1dG9yIG11c3Qgc3BlY2lmeSBhIHRzbGludCBjb25maWd1cmF0aW9uLicpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gX2dldEZpbGVDb250ZW50KFxuICBmaWxlOiBzdHJpbmcsXG4gIG9wdGlvbnM6IFRzbGludEZpeFRhc2tPcHRpb25zLFxuICBwcm9ncmFtPzogdHMuUHJvZ3JhbSxcbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIC8vIFRoZSBsaW50ZXIgcmV0cmlldmVzIHRoZSBTb3VyY2VGaWxlIFRTIG5vZGUgZGlyZWN0bHkgaWYgYSBwcm9ncmFtIGlzIHVzZWRcbiAgaWYgKHByb2dyYW0pIHtcbiAgICBjb25zdCBzb3VyY2UgPSBwcm9ncmFtLmdldFNvdXJjZUZpbGUoZmlsZSk7XG4gICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VcbiAgICAgICAgPSBgRmlsZSAnJHtmaWxlfScgaXMgbm90IHBhcnQgb2YgdGhlIFR5cGVTY3JpcHQgcHJvamVjdCAnJHtvcHRpb25zLnRzQ29uZmlnUGF0aH0nLmA7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNvdXJjZS5nZXRGdWxsVGV4dChzb3VyY2UpO1xuICB9XG5cbiAgLy8gTk9URTogVGhlIHRzbGludCBDTEkgY2hlY2tzIGZvciBhbmQgZXhjbHVkZXMgTVBFRyB0cmFuc3BvcnQgc3RyZWFtczsgdGhpcyBkb2VzIG5vdC5cbiAgdHJ5IHtcbiAgICAvLyBTdHJpcCBCT00gZnJvbSBmaWxlIGRhdGEuXG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjQzNTY3MTNcbiAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKGZpbGUsICd1dGYtOCcpLnJlcGxhY2UoL15cXHVGRUZGLywgJycpO1xuICB9IGNhdGNoIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCByZWFkIGZpbGUgJyR7ZmlsZX0nLmApO1xuICB9XG59XG5cblxuZnVuY3Rpb24gX2xpc3RBbGxGaWxlcyhyb290OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcblxuICBmdW5jdGlvbiBfcmVjdXJzZShsb2NhdGlvbjogc3RyaW5nKSB7XG4gICAgY29uc3QgZGlyID0gZnMucmVhZGRpclN5bmMocGF0aC5qb2luKHJvb3QsIGxvY2F0aW9uKSk7XG5cbiAgICBkaXIuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNvbnN0IGxvYyA9IHBhdGguam9pbihsb2NhdGlvbiwgbmFtZSk7XG4gICAgICBpZiAoZnMuc3RhdFN5bmMocGF0aC5qb2luKHJvb3QsIGxvYykpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgX3JlY3Vyc2UobG9jKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGxvYyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgX3JlY3Vyc2UoJycpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKTogVGFza0V4ZWN1dG9yPFRzbGludEZpeFRhc2tPcHRpb25zPiB7XG4gIHJldHVybiAob3B0aW9uczogVHNsaW50Rml4VGFza09wdGlvbnMsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzID0+IHtcbiAgICAgIGNvbnN0IHJvb3QgPSBwcm9jZXNzLmN3ZCgpO1xuICAgICAgY29uc3QgdHNsaW50ID0gcmVxdWlyZShyZXNvbHZlKCd0c2xpbnQnLCB7XG4gICAgICAgIGJhc2VkaXI6IHJvb3QsXG4gICAgICAgIGNoZWNrR2xvYmFsOiB0cnVlLFxuICAgICAgICBjaGVja0xvY2FsOiB0cnVlLFxuICAgICAgfSkpO1xuICAgICAgY29uc3QgaW5jbHVkZXMgPSAoXG4gICAgICAgIEFycmF5LmlzQXJyYXkob3B0aW9ucy5pbmNsdWRlcylcbiAgICAgICAgICA/IG9wdGlvbnMuaW5jbHVkZXNcbiAgICAgICAgICA6IChvcHRpb25zLmluY2x1ZGVzID8gW29wdGlvbnMuaW5jbHVkZXNdIDogW10pXG4gICAgICApO1xuICAgICAgY29uc3QgZmlsZXMgPSAoXG4gICAgICAgIEFycmF5LmlzQXJyYXkob3B0aW9ucy5maWxlcylcbiAgICAgICAgICA/IG9wdGlvbnMuZmlsZXNcbiAgICAgICAgICA6IChvcHRpb25zLmZpbGVzID8gW29wdGlvbnMuZmlsZXNdIDogW10pXG4gICAgICApO1xuXG4gICAgICBjb25zdCBMaW50ZXIgPSB0c2xpbnQuTGludGVyIGFzIExpbnRlclQ7XG4gICAgICBjb25zdCBDb25maWd1cmF0aW9uID0gdHNsaW50LkNvbmZpZ3VyYXRpb24gYXMgQ29uZmlndXJhdGlvblQ7XG4gICAgICBsZXQgcHJvZ3JhbTogdHMuUHJvZ3JhbSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBmaWxlc1RvTGludDogc3RyaW5nW10gPSBmaWxlcztcblxuICAgICAgaWYgKG9wdGlvbnMudHNDb25maWdQYXRoICYmIGZpbGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGNvbnN0IHRzQ29uZmlnUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBvcHRpb25zLnRzQ29uZmlnUGF0aCk7XG5cbiAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKHRzQ29uZmlnUGF0aCkpIHtcbiAgICAgICAgICBvYnMuZXJyb3IobmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCB0c2NvbmZpZy4nKSk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcHJvZ3JhbSA9IExpbnRlci5jcmVhdGVQcm9ncmFtKHRzQ29uZmlnUGF0aCk7XG4gICAgICAgIGZpbGVzVG9MaW50ID0gTGludGVyLmdldEZpbGVOYW1lcyhwcm9ncmFtKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGluY2x1ZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgYWxsRmlsZXNSZWwgPSBfbGlzdEFsbEZpbGVzKHJvb3QpO1xuICAgICAgICBjb25zdCBwYXR0ZXJuID0gJ14oJ1xuICAgICAgICAgICsgKGluY2x1ZGVzIGFzIHN0cmluZ1tdKVxuICAgICAgICAgICAgLm1hcChleCA9PiAnKCdcbiAgICAgICAgICAgICAgKyBleC5zcGxpdCgvW1xcL1xcXFxdL2cpLm1hcChmID0+IGZcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xcLVxcW1xcXXt9KCkrPy5eJHxdL2csICdcXFxcJCYnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwqXFwqL2csICcoLis/KT8nKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCovZywgJ1teL1xcXFxcXFxcXSonKSlcbiAgICAgICAgICAgICAgICAuam9pbignW1xcL1xcXFxcXFxcXScpXG4gICAgICAgICAgICAgICsgJyknKVxuICAgICAgICAgICAgLmpvaW4oJ3wnKVxuICAgICAgICAgICsgJykoJHwvfFxcXFxcXFxcKSc7XG4gICAgICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChwYXR0ZXJuKTtcblxuICAgICAgICBmaWxlc1RvTGludC5wdXNoKC4uLmFsbEZpbGVzUmVsXG4gICAgICAgICAgLmZpbHRlcih4ID0+IHJlLnRlc3QoeCkpXG4gICAgICAgICAgLm1hcCh4ID0+IHBhdGguam9pbihyb290LCB4KSksXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpbnRPcHRpb25zID0ge1xuICAgICAgICBmaXg6IHRydWUsXG4gICAgICAgIGZvcm1hdHRlcjogb3B0aW9ucy5mb3JtYXQgfHwgJ3Byb3NlJyxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGxpbnRlciA9IG5ldyBMaW50ZXIobGludE9wdGlvbnMsIHByb2dyYW0pO1xuICAgICAgLy8gSWYgZGlyZWN0b3J5IGRvZXNuJ3QgY2hhbmdlLCB3ZVxuICAgICAgbGV0IGxhc3REaXJlY3Rvcnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgICAgbGV0IGNvbmZpZztcblxuICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzVG9MaW50KSB7XG4gICAgICAgIGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShmaWxlKTtcbiAgICAgICAgaWYgKGxhc3REaXJlY3RvcnkgIT09IGRpcikge1xuICAgICAgICAgIGxhc3REaXJlY3RvcnkgPSBkaXI7XG4gICAgICAgICAgY29uZmlnID0gX2xvYWRDb25maWd1cmF0aW9uKENvbmZpZ3VyYXRpb24sIG9wdGlvbnMsIHJvb3QsIGZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBfZ2V0RmlsZUNvbnRlbnQoZmlsZSwgb3B0aW9ucywgcHJvZ3JhbSk7XG5cbiAgICAgICAgaWYgKCFjb250ZW50KSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBsaW50ZXIubGludChmaWxlLCBjb250ZW50LCBjb25maWcpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBsaW50ZXIuZ2V0UmVzdWx0KCk7XG5cbiAgICAgIC8vIEZvcm1hdCBhbmQgc2hvdyB0aGUgcmVzdWx0cy5cbiAgICAgIGlmICghb3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgY29uc3QgRm9ybWF0dGVyID0gdHNsaW50LmZpbmRGb3JtYXR0ZXIob3B0aW9ucy5mb3JtYXQgfHwgJ3Byb3NlJyk7XG4gICAgICAgIGlmICghRm9ybWF0dGVyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGxpbnQgZm9ybWF0IFwiJHtvcHRpb25zLmZvcm1hdH1cIi5gKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmb3JtYXR0ZXIgPSBuZXcgRm9ybWF0dGVyKCk7XG5cbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gZm9ybWF0dGVyLmZvcm1hdChyZXN1bHQuZmFpbHVyZXMsIHJlc3VsdC5maXhlcyk7XG4gICAgICAgIGlmIChvdXRwdXQpIHtcbiAgICAgICAgICBjb250ZXh0LmxvZ2dlci5pbmZvKG91dHB1dCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFvcHRpb25zLmlnbm9yZUVycm9ycyAmJiByZXN1bHQuZXJyb3JDb3VudCA+IDApIHtcbiAgICAgICAgb2JzLmVycm9yKG5ldyBFcnJvcignTGludCBlcnJvcnMgd2VyZSBmb3VuZC4nKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYnMubmV4dCgpO1xuICAgICAgICBvYnMuY29tcGxldGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn1cbiJdfQ==