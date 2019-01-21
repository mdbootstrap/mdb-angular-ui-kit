"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const schematics_utilities_1 = require("schematics-utilities");
function addPackageJsonDependencies() {
    return (host, context) => {
        const dependencies = [
            { type: schematics_utilities_1.NodeDependencyType.Default, version: '^2.7.2', name: 'chart.js' },
            { type: schematics_utilities_1.NodeDependencyType.Default, version: '^2.7.40', name: '@types/chart.js' },
            { type: schematics_utilities_1.NodeDependencyType.Default, version: '~4.7.x', name: 'font-awesome' },
            { type: schematics_utilities_1.NodeDependencyType.Default, version: '~2.0.8', name: 'hammerjs' }
        ];
        dependencies.forEach(dependency => {
            schematics_utilities_1.addPackageJsonDependency(host, dependency);
            context.logger.log('info', `Added "${dependency.name}" into ${dependency.type}`);
        });
        return host;
    };
}
function installPackageJsonDependencies() {
    return (host, context) => {
        context.addTask(new tasks_1.NodePackageInstallTask());
        context.logger.log('info', 'Installing packages...');
        return host;
    };
}
function addModuleToImports(options) {
    return (host, context) => {
        const workspace = schematics_utilities_1.getWorkspace(host);
        const project = schematics_utilities_1.getProjectFromWorkspace(workspace, options.project ? options.project : Object.keys(workspace['projects'])[0]);
        const moduleName = 'MDBBootstrapModule';
        schematics_utilities_1.addModuleImportToRootModule(host, moduleName, 'angular-bootstrap-md', project);
        context.logger.log('info', `"${moduleName}" is imported.`);
        return host;
    };
}
function updateModuleWithForRootMethod() {
    return (host, context) => {
        try {
            const appModule = host.read('./src/app/app.module.ts');
            if (appModule) {
                const content = appModule.toString('utf-8');
                const newContent = content.replace(/(\n\s+)(MDBBootstrapModule)(\n)/g, '$1$2.forRoot()$3');
                context.logger.log('info', '.forRoot() method should be added for MDBBootrapModule. If not, please add it!');
                host.overwrite('./src/app/app.module.ts', newContent);
            }
        }
        catch (error) {
            context.logger.error(`.forRoot() method wasn't added: ${error}`);
        }
        return host;
    };
}
function addStylesAndScriptsToAngularJson(options) {
    return (host, context) => {
        const additionalStyles = [
            { name: 'fontawesome', path: 'node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss' },
            { name: 'fontawesome-solid', path: 'node_modules/@fortawesome/fontawesome-free/scss/solid.scss' },
            { name: 'fontawesome-regular', path: 'node_modules/@fortawesome/fontawesome-free/scss/regular.scss' },
            { name: 'fontawesome-brand', path: 'node_modules/@fortawesome/fontawesome-free/scss/brands.scss' },
            { name: 'bootstrap', path: 'node_modules/angular-bootstrap-md/scss/bootstrap/bootstrap.scss' },
            { name: 'mdb', path: 'node_modules/angular-bootstrap-md/scss/mdb-free.scss' }
        ];
        const additionalScripts = [
            { name: 'chart.js', path: 'node_modules/chart.js/dist/Chart.js' },
            { name: 'hammerjs', path: 'node_modules/hammerjs/hammer.min.js' }
        ];
        try {
            const angularJsonFile = host.read('angular.json');
            if (angularJsonFile) {
                const angularJsonFileObject = JSON.parse(angularJsonFile.toString('utf-8'));
                const project = options.project ? options.project : Object.keys(angularJsonFileObject['projects'])[0];
                const projectObject = angularJsonFileObject.projects[project];
                const styles = projectObject.architect.build.options.styles;
                const scripts = projectObject.architect.build.options.scripts;
                additionalStyles.forEach(style => {
                    styles.push(style.path);
                    context.logger.log('info', `Added "${style.name} into angular.json file"`);
                });
                additionalScripts.forEach(script => {
                    scripts.push(script.path);
                    context.logger.log('info', `Added "${script.name} into angular.json file"`);
                });
                host.overwrite('angular.json', JSON.stringify(angularJsonFileObject, null, 2));
            }
        }
        catch (error) {
            context.logger.log('error', 'Failed to add scripts or styles to angular.json');
        }
        return host;
    };
}
function ngAdd(options) {
    return schematics_1.chain([
        options && options.skipPackageJson ? schematics_1.noop() : addPackageJsonDependencies(),
        options && options.skipPackageJson ? schematics_1.noop() : installPackageJsonDependencies(),
        options && options.skipModuleImport ? schematics_1.noop() : addModuleToImports(options),
        updateModuleWithForRootMethod(),
        addStylesAndScriptsToAngularJson(options)
    ]);
}
exports.ngAdd = ngAdd;
//# sourceMappingURL=index.js.map