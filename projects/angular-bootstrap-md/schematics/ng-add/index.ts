import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { RunSchematicTask, NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';
import { addPackageToPackageJson } from './package';

// Just return the tree
export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const angularDependencyVersion = '^9.0.0';

    addPackageToPackageJson(tree, '@angular/cdk', angularDependencyVersion);
    addPackageToPackageJson(tree, '@angular/forms', angularDependencyVersion);
    addPackageToPackageJson(tree, '@angular/animations', angularDependencyVersion);

    if (options.externalDependencies) {
      addPackageToPackageJson(tree, 'chart.js', '^2.7.2');
      addPackageToPackageJson(tree, '@types/chart.js', '^2.7.40');
      addPackageToPackageJson(tree, '@fortawesome/fontawesome-free', '~5.6.3');
      addPackageToPackageJson(tree, 'hammerjs', '~2.0.8');
      addPackageToPackageJson(tree, 'animate.css', '~3.7.2');
    }

    const installMainDependenciesTask = context.addTask(new NodePackageInstallTask());

    context.addTask(new RunSchematicTask('ng-add-mdb-setup', options), [installMainDependenciesTask]);
  };
}
