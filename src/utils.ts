import {
  getStringRecordValue,
  isTruthyString,
  isValidSemver,
} from '@metamask/action-utils';

import {
  fixedOrIndependent,
  GITHUB_REPOSITORY,
  GITHUB_REPOSITORY_ERROR,
  GITHUB_WORKSPACE,
  GITHUB_WORKSPACE_ERROR,
  RELEASE_STRATEGY,
  RELEASE_STRATEGY_ERROR,
  RELEASE_VERSION,
  RELEASE_VERSION_ERROR,
} from './constants';

interface ExpectedProcessEnv extends Partial<Record<string, string>> {
  // The root of the workspace running this action
  GITHUB_WORKSPACE?: string;
  // The owner and repository name, e.g. Octocat/Hello-World
  GITHUB_REPOSITORY?: string;
  // The version to be released
  RELEASE_VERSION?: string;
  // The release strategy. "fixed" or "independent"
  RELEASE_STRATEGY?: string;
}

/**
 * Add missing properties to "process.env" interface.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends ExpectedProcessEnv {}
  }
}

interface ParsedEnvironmentVariables {
  releaseVersion: string;
  releaseStrategy: string;
  repoUrl: string;
  workspaceRoot: string;
}

/**
 * Matches valid "Orgname/Reponame" strings.
 *
 * Organization names may only have non-consecutive hyphens and alphanumerical
 * characters, and may not start or end with hyphens. We don't deal with the
 * non-consecutive edge case.
 *
 * Repo names are more permissive, but in practice the URLs will only include
 * alphanumerical characters, hyphens, underscores, and periods.
 */
const githubRepoIdRegEx = /^[\d\w](?:[\d\w-]*[\d\w])*\/[\d\w_.-]+$/iu;

/**
 * Utility function for parsing expected environment variables.
 *
 * We parameterize process.env for testing purposes.
 *
 * @param environmentVariables - The environment variables to parse.
 * @returns The parsed environment variables.
 */
export function parseEnvironmentVariables(
  environmentVariables: ExpectedProcessEnv = process.env,
): ParsedEnvironmentVariables {
  const githubWorkspace = getStringRecordValue(
    GITHUB_WORKSPACE,
    environmentVariables,
  );
  if (!isTruthyString(githubWorkspace)) {
    throw new Error(GITHUB_WORKSPACE_ERROR);
  }

  const githubRepository = getStringRecordValue(
    GITHUB_REPOSITORY,
    environmentVariables,
  );
  if (!githubRepoIdRegEx.test(githubRepository)) {
    throw new Error(GITHUB_REPOSITORY_ERROR);
  }

  const releaseVersion = getStringRecordValue(
    RELEASE_VERSION,
    environmentVariables,
  );
  if (!isTruthyString(releaseVersion) || !isValidSemver(releaseVersion)) {
    throw new Error(RELEASE_VERSION_ERROR);
  }

  const releaseStrategy = getStringRecordValue(
    RELEASE_STRATEGY,
    environmentVariables,
  );

  if (!fixedOrIndependent(releaseStrategy)) {
    throw new Error(RELEASE_STRATEGY_ERROR);
  }

  console.log(githubRepository);

  return {
    // Improvement: this should instead just come from the package.json file?
    releaseVersion,
    // Improvement: this should instead just come from the package.json file?
    repoUrl: `https://github.com/${githubRepository}`,

    releaseStrategy,
    workspaceRoot: githubWorkspace,
  };
}
