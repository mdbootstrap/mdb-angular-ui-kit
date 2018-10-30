export interface Schema {
  /**
   * Skip adding dependencies and installing them
   */
  skipPackageJson?: boolean;

  /**
   * Skip importing the module into the root module of the host application
   */
  skipModuleImport?: boolean;

  /**
   * The project that needs the polyfill scripts
   */
  project?: string;
}
