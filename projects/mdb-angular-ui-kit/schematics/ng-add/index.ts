import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { RunSchematicTask, NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';
import { addPackageToPackageJson } from './package';

// Just return the tree
export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const angularDependencyVersion = '^11.0.0';

    addPackageToPackageJson(tree, '@angular/cdk', angularDependencyVersion);
    addPackageToPackageJson(tree, '@angular/forms', angularDependencyVersion);
    addPackageToPackageJson(tree, '@angular/animations', angularDependencyVersion);

    if (options.fontAwesome) {
      addPackageToPackageJson(tree, '@fortawesome/fontawesome-free', '^5.15.1');
    }

    const installMainDependenciesTask = context.addTask(new NodePackageInstallTask());

    context.addTask(new RunSchematicTask('ng-add-mdb-setup', options), [
      installMainDependenciesTask,
    ]);
  };
}
