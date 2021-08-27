import { SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';
import {
  getAppModulePath,
  getProjectMainFile,
  hasNgModuleImport,
  addModuleImportToRootModule,
  getProjectFromWorkspace,
  getProjectIndexFiles,
  appendHtmlElementToHead,
  getProjectStyleFile,
} from '@angular/cdk/schematics';
import { Schema } from './schema';

// tslint:disable-next-line: space-before-function-paren
export default function (options: Schema): any {
  return async (tree: Tree) => {
    const workspace = await getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);

    if (project.extensions.projectType === ProjectType.Application) {
      return chain([
        addMdbModuleImport(options),
        addAngularAnimationsModule(options),
        addStylesImports(options),
        addRobotoFontToIndexHtml(options),
      ]);
    }
    return;
  };
}

function addMdbModuleImport(options: Schema): any {
  return async (tree: Tree) => {
    const workspace: any = await getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const mdbModuleName = 'MdbModule';
    const mdbModulePath = 'mdb-angular-ui-kit';

    addModuleImportToRootModule(tree, mdbModuleName, mdbModulePath, project);

    return tree;
  };
}

function addAngularAnimationsModule(options: Schema): any {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace: any = await getWorkspace(tree);
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

function addRobotoFontToIndexHtml(options: Schema): any {
  return async (tree: Tree, context: SchematicContext) => {
    const fontUrl = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,600&display=swap';
    const workspace: any = await getWorkspace(tree);
    const project: any = getProjectFromWorkspace(workspace);
    const projectIndexFiles = getProjectIndexFiles(project);
    const logger = context.logger;

    if (options.robotoFont) {
      if (!projectIndexFiles.length) {
        logger.error('Index HTML not found');
        logger.info('Add roboto font manually');
        return;
      }

      projectIndexFiles.forEach((indexFile: any) => {
        appendHtmlElementToHead(tree, indexFile, `<link href="${fontUrl}" rel="stylesheet">`);
      });
    }

    return tree;
  };
}

function addStylesImports(options: Schema): any {
  return async (host: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);
    const logger = context.logger;
    const styleFilePath = getProjectStyleFile(project);

    if (!styleFilePath) {
      logger.error(
        `Could not find the default style file for this project. Please add styles imports manually`
      );
      return;
    }

    const buffer = host.read(styleFilePath);

    if (!buffer) {
      logger.error(
        `Could not read the default style file for this project. Please add styles imports manually`
      );
      return;
    }

    const fileContent = buffer.toString();

    let newContent: string;

    if (options.fontAwesome) {
      newContent =
        `@import '~@fortawesome/fontawesome-free/scss/fontawesome.scss';\n` +
        `@import '~@fortawesome/fontawesome-free/scss/solid.scss';\n` +
        `@import '~@fortawesome/fontawesome-free/scss/regular.scss';\n` +
        `@import '~@fortawesome/fontawesome-free/scss/brands.scss';\n \n` +
        `@import '~mdb-angular-ui-kit/assets/scss/mdb.scss';\n`;
    } else {
      newContent = `@import '~mdb-angular-ui-kit/assets/scss/mdb.scss';\n`;
    }

    if (fileContent.includes(newContent)) {
      return;
    }

    const recorder = host.beginUpdate(styleFilePath);

    recorder.insertLeft(fileContent.length, newContent);
    host.commitUpdate(recorder);
  };
}
