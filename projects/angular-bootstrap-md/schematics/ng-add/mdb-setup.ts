import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import {
  getAppModulePath,
  getProjectMainFile,
  hasNgModuleImport,
  addModuleImportToRootModule,
  getProjectFromWorkspace,
  getProjectIndexFiles,
  appendHtmlElementToHead,
} from '@angular/cdk/schematics';
import { Schema } from './schema';

export default function(options: Schema): Rule {
  return chain([
    addMdbFreeModuleImport(options),
    addAngularAnimationsModule(options),
    addStylesAndScriptsToAngularJson(options),
    addRobotoFontToIndexHtml(),
  ]);
}

function addMdbFreeModuleImport(options: Schema) {
  return (tree: Tree) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const mdbFreeModuleName = 'MDBBootstrapModule.forRoot()';
    const mdbFreeModulePath = 'angular-bootstrap-md';

    addModuleImportToRootModule(tree, mdbFreeModuleName, mdbFreeModulePath, project);

    return tree;
  };
}


function addAngularAnimationsModule(options: Schema) {
  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const appModulePath = getAppModulePath(tree, getProjectMainFile(project));
    const browserAnimationModule = 'BrowserAnimationsModule';
    const animationsModulePath = '@angular/platform-browser/animations';
    const noopAnimationModule = 'NoopAnimationsModule';

    if (options.animations) {
      if (hasNgModuleImport(tree, appModulePath, noopAnimationModule)) {
        context.logger.error(
          `Could not add ${browserAnimationModule} because ${noopAnimationModule} is already added`
        );
        return;
      }

      addModuleImportToRootModule(tree, browserAnimationModule, animationsModulePath, project);
    } else if (!hasNgModuleImport(tree, appModulePath, noopAnimationModule)) {
      addModuleImportToRootModule(tree, noopAnimationModule, animationsModulePath, project);
    }

    return tree;
  };
}

function addRobotoFontToIndexHtml() {
  return (tree: Tree, context: SchematicContext) => {
    const fontUrl = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,600&display=swap';
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace);
    const projectIndexFiles = getProjectIndexFiles(project);
    const logger = context.logger;

    if (!projectIndexFiles.length) {
      logger.error('Index HTML not found');
      logger.info('Add roboto font manually');
      return;
    }

    projectIndexFiles.forEach((indexFile: any) => {
      appendHtmlElementToHead(tree, indexFile, `<link href="${fontUrl}" rel="stylesheet">`);
    });

    return tree;
  };
}

function addStylesAndScriptsToAngularJson(options: Schema) {
  return (tree: Tree, context: SchematicContext) => {
    const logger = context.logger;
    const mainStyles = [
      {
        name: 'bootstrap',
        path: './node_modules/angular-bootstrap-md/assets/scss/bootstrap/bootstrap.scss',
      },
      { name: 'mdb', path: './node_modules/angular-bootstrap-md/assets/scss/mdb.scss' },
    ];

    const additionalStyles = [
      {
        name: 'fontawesome',
        path: './node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss',
      },
      {
        name: 'fontawesome-solid',
        path: './node_modules/@fortawesome/fontawesome-free/scss/solid.scss',
      },
      {
        name: 'fontawesome-regular',
        path: './node_modules/@fortawesome/fontawesome-free/scss/regular.scss',
      },
      {
        name: 'fontawesome-brand',
        path: './node_modules/@fortawesome/fontawesome-free/scss/brands.scss',
      },
      { name: 'animate.css', path: './node_modules/animate.css/animate.css' },
    ];

    const allStyles = options.externalDependencies ? [...mainStyles, ...additionalStyles] : mainStyles;
    const additionalScripts = [
      { name: 'chart.js', path: './node_modules/chart.js/dist/Chart.js' },
      { name: 'hammerjs', path: './node_modules/hammerjs/hammer.min.js' },
    ];

    const angularJsonFile = tree.read('angular.json');

    if (angularJsonFile) {
      const angularJsonFileObject = JSON.parse(angularJsonFile.toString('utf-8'));
      const project = options.project
        ? options.project
        : Object.keys(angularJsonFileObject['projects'])[0];
      const projectObject = angularJsonFileObject.projects[project];
      const styles = projectObject.architect.build.options.styles;
      const scripts = projectObject.architect.build.options.scripts;

      allStyles.forEach(style => {
        styles.unshift(style.path);
      });

      additionalScripts.forEach(script => {
        scripts.push(script.path);
      });
      tree.overwrite('angular.json', JSON.stringify(angularJsonFileObject, null, 2));
    } else {
      logger.error('Failed to add scripts or styles to angular.json');
    }

    return tree;
  };
}
