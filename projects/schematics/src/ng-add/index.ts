import { chain, noop, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addModuleImportToRootModule,
  addPackageJsonDependency,
  getProjectFromWorkspace,
  getWorkspace,
  NodeDependency,
  NodeDependencyType
} from 'schematics-utilities';

import { Schema } from './schema';

function addPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      { type: NodeDependencyType.Default, version: '^2.7.2', name: 'chart.js' },
      { type: NodeDependencyType.Default, version: '^2.7.40', name: '@types/chart.js' },
      { type: NodeDependencyType.Default, version: '~4.7.x', name: 'font-awesome' },
      { type: NodeDependencyType.Default, version: '~2.0.8', name: 'hammerjs' },
      { type: NodeDependencyType.Default, version: '^6.2.6', name: 'angular-bootstrap-md' },
    ];

    dependencies.forEach(dependency => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `Added "${dependency.name}" into ${dependency.type}`);
    });

    return host;
  };
}

function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', 'Installing packages...');

    return host;
  };
}

function addModuleToImports(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project ? options.project : Object.keys(workspace['projects'])[0]);
    const moduleName = 'MDBBootstrapModule';

    addModuleImportToRootModule(host, moduleName, 'angular-bootstrap-md', project);
    context.logger.log('info', `"${moduleName}" is imported.`);

    return host;
  };
}

function updateModuleWithForRootMethod(): Rule {
  return (host: Tree, context: SchematicContext) => {
    try {
      const appModule = host.read('./src/app/app.module.ts');
      if (appModule) {
        const content = appModule.toString('utf-8');
        const newContent: any = content.replace(/(\n\s+)(MDBBootstrapModule)(\n)/g, '$1$2.forRoot()$3');
        context.logger.log('info', '.forRoot() method should be added for MDBBootrapModule. If not, please add it!');
        host.overwrite('./src/app/app.module.ts', newContent);
      }
    } catch (error) {
      context.logger.error(`.forRoot() method wasn't added: ${error}`);
    }
    return host;
  };
}

function addStylesAndScriptsToAngularJson(options: any) {
  return (host: Tree, context: SchematicContext) => {

    const additionalStyles = [
      { name: 'font-awesome', path: "node_modules/font-awesome/scss/font-awesome.scss" },
      { name: 'bootstrap', path: "node_modules/angular-bootstrap-md/scss/bootstrap/bootstrap.scss" },
      { name: 'mdb', path: "node_modules/angular-bootstrap-md/scss/mdb-free.scss" }
    ];
    const additionalScripts = [
      { name: 'chart.js', path: "node_modules/chart.js/dist/Chart.js" },
      { name: 'hammerjs', path: "node_modules/hammerjs/hammer.min.js" }
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
    } catch (error) {
      context.logger.log('error', 'Failed to add scripts or styles to angular.json');
    }

    return host;
  };
}

export function ngAdd(options: any): Rule {
  return chain([
    options && options.skipPackageJson ? noop() : addPackageJsonDependencies(),
    options && options.skipPackageJson ? noop() : installPackageJsonDependencies(),
    options && options.skipModuleImport ? noop() : addModuleToImports(options),
    updateModuleWithForRootMethod(),
    addStylesAndScriptsToAngularJson(options)
  ]);
}
