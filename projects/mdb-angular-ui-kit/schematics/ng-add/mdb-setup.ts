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
        updateAppComponentContent(),
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

function updateAppComponentContent(): any {
  return async (host: Tree, context: SchematicContext) => {
    const filePath = './src/app/app.component.html';
    const logger = context.logger;
    const buffer = host.read(filePath);

    if (!buffer) {
      logger.error('No buffer');
      return;
    }

    const fileContent = buffer.toString();

    const defaultContent =
    `<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->\n` +
    `<!-- * * * * * * * * * * * The content below * * * * * * * * * * * -->\n` +
    `<!-- * * * * * * * * * * is only a placeholder * * * * * * * * * * -->\n` +
    `<!-- * * * * * * * * * * and can be replaced. * * * * * * * * * * * -->\n` +
    `<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->\n` +
    `<!-- * * * * * * * * * Delete the template below * * * * * * * * * * -->\n` +
    `<!-- * * * * * * * to get started with your project! * * * * * * * * -->\n` +
    `<!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * -->\n`;

    const newContent =
      `<div class="container">\n` +
      `  <div class="d-flex justify-content-center align-items-center" style="height: 100vh">\n` +
      `    <div class="text-center">\n` +
      `      <img\n` +
      `        class="mb-4"\n` +
      `        src="https://mdbootstrap.com/img/logo/mdb-transparent-250px.png"\n` +
      `        style="width: 250px; height: 90px"\n` +
      `      />\n` +
      `      <h5 class="mb-3">Thank you for using our product. We're glad you're with us.</h5>\n` +
      `      <p class="mb-3">MDB Team</p>\n` +
      `      <p>\n` +
      `        PS. We'll be releasing "How to build your first project with MDB 5 Angular" tutorial soon.\n` +
      `      </p>\n` +
      `      <a\n` +
      `      class="btn btn-primary btn-lg"\n` +
      `      href=" https://mdbootstrap.com/newsletter/"\n` +
      `      target="_blank"\n` +
      `      role="button"\n` +
      `      >Join now</a\n` +
      `      >\n` +
      `    </div>\n` +
      `  </div>\n` +
      `</div>`;

    const hasNewContent = fileContent.includes(newContent);
    const hasDefaultContent = fileContent.includes(defaultContent);

    if (hasNewContent || !hasDefaultContent) {
      return;
    }

    const recorder = host.beginUpdate(filePath);

    recorder.remove(0, fileContent.length);
    recorder.insertLeft(0, newContent);
    host.commitUpdate(recorder);
  };
}
