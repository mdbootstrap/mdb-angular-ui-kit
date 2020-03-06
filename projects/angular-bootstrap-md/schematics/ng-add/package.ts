import { Tree } from '@angular-devkit/schematics';

function sortObjectByKeys(obj: any) {
  return Object.keys(obj)
    .sort()
    .reduce((result: any, key) => (result[key] = obj[key]) && result, {});
}

export function addPackageToPackageJson(tree: Tree, pkg: string, version: string): Tree {
  if (tree.exists('package.json')) {
    const packageJsonFile = tree.read('package.json');
    const sourceText = packageJsonFile && packageJsonFile.toString('utf-8');
    const json = sourceText && JSON.parse(sourceText);

    if (!json.dependencies) {
      json.dependencies = {};
    }

    if (!json.dependencies[pkg]) {
      json.dependencies[pkg] = version;
      json.dependencies = sortObjectByKeys(json.dependencies);
    }

    tree.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return tree;
}
