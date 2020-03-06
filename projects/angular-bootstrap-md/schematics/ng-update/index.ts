import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import {
    getProjectFromWorkspace,
    getProjectIndexFiles,
    appendHtmlElementToHead,
  } from '@angular/cdk/schematics';

export function updateToV9(): Rule {
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
