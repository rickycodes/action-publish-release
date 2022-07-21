export const FIXED = 'fixed';
export const INDEPENDENT = 'independent';

export const fixedOrIndependent = (value: string) =>
  value === FIXED || value === INDEPENDENT;

// error messages
export const GITHUB_WORKSPACE_ERROR =
  'process.env.GITHUB_WORKSPACE must be set.';

export const GITHUB_REPOSITORY_ERROR =
  'process.env.GITHUB_REPOSITORY must be a valid GitHub repository identifier.';
export const RELEASE_VERSION_ERROR =
  'process.env.RELEASE_VERSION must be a valid SemVer version.';
export const RELEASE_STRATEGY_ERROR = `process.env.RELEASE_STRATEGY must be one of "${FIXED}" or "${INDEPENDENT}"`;

// environment variables
export const GITHUB_WORKSPACE = 'GITHUB_WORKSPACE';
export const GITHUB_REPOSITORY = 'GITHUB_REPOSITORY';
export const RELEASE_VERSION = 'RELEASE_VERSION';
export const RELEASE_STRATEGY = 'RELEASE_STRATEGY';
