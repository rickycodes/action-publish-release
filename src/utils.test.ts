import {
  GITHUB_REPOSITORY_ERROR,
  RELEASE_STRATEGY_ERROR,
  RELEASE_VERSION_ERROR,
} from './constants';
import { parseEnvironmentVariables } from './utils';

describe('parseEnvironmentVariables', () => {
  let originalGithubWorkspace: string | undefined,
    originalGithubRepository: string | undefined;

  // In CI, some of these are set.
  beforeAll(() => {
    originalGithubWorkspace = process.env.GITHUB_WORKSPACE;
    originalGithubRepository = process.env.GITHUB_REPOSITORY;
    delete process.env.GITHUB_WORKSPACE;
    delete process.env.GITHUB_REPOSITORY;
  });

  afterAll(() => {
    if ('GITHUB_WORKSPACE' in process.env) {
      process.env.GITHUB_WORKSPACE = originalGithubWorkspace;
    }
    if ('GITHUB_REPOSITORY' in process.env) {
      process.env.GITHUB_REPOSITORY = originalGithubRepository;
    }
  });

  it('successfully parses valid environment variables', () => {
    expect(
      parseEnvironmentVariables({
        GITHUB_WORKSPACE: 'foo',
        GITHUB_REPOSITORY: 'Org/Name',
        RELEASE_VERSION: '1.0.0',
        RELEASE_STRATEGY: 'fixed',
      }),
    ).toStrictEqual({
      releaseVersion: '1.0.0',
      releaseStrategy: 'fixed',
      repoUrl: 'https://github.com/Org/Name',
      workspaceRoot: 'foo',
    });
  });

  it('throws if GITHUB_WORKSPACE is invalid', () => {
    const errorMessage = 'process.env.GITHUB_WORKSPACE must be set.';

    expect(() =>
      parseEnvironmentVariables({
        GITHUB_WORKSPACE: '',
        GITHUB_REPOSITORY: 'Org/Name',
        RELEASE_VERSION: '1.0.0',
        RELEASE_STRATEGY: 'fixed',
      }),
    ).toThrow(errorMessage);
    expect(() => parseEnvironmentVariables()).toThrow(errorMessage);
  });

  it('throws if GITHUB_REPOSITORY is invalid', () => {
    const errorMessage = GITHUB_REPOSITORY_ERROR;

    expect(() =>
      parseEnvironmentVariables({
        GITHUB_WORKSPACE: 'foo',
        GITHUB_REPOSITORY: '',
        RELEASE_VERSION: '1.0.0',
        RELEASE_STRATEGY: 'fixed',
      }),
    ).toThrow(errorMessage);
    expect(() =>
      parseEnvironmentVariables({
        GITHUB_WORKSPACE: 'foo',
        GITHUB_REPOSITORY: 'Org/',
        RELEASE_VERSION: '1.0.0',
        RELEASE_STRATEGY: 'fixed',
      }),
    ).toThrow(errorMessage);
    expect(() =>
      parseEnvironmentVariables({
        GITHUB_WORKSPACE: 'foo',
        GITHUB_REPOSITORY: '/Name',
        RELEASE_VERSION: '1.0.0',
        RELEASE_STRATEGY: 'fixed',
      }),
    ).toThrow(errorMessage);
  });

  it('throws if RELEASE_VERSION is invalid', () => {
    const errorMessage = RELEASE_VERSION_ERROR;

    expect(() =>
      parseEnvironmentVariables({
        GITHUB_WORKSPACE: 'foo',
        GITHUB_REPOSITORY: 'Org/Name',
        RELEASE_VERSION: '',
        RELEASE_STRATEGY: 'fixed',
      }),
    ).toThrow(errorMessage);
    expect(() =>
      parseEnvironmentVariables({
        GITHUB_WORKSPACE: 'foo',
        GITHUB_REPOSITORY: 'Org/Name',
        RELEASE_VERSION: 'kaplar',
        RELEASE_STRATEGY: 'fixed',
      }),
    ).toThrow(errorMessage);
  });

  it('throws if STRATEGY is invalid', () => {
    const errorMessage = RELEASE_STRATEGY_ERROR;

    expect(() =>
      parseEnvironmentVariables({
        GITHUB_WORKSPACE: 'foo',
        GITHUB_REPOSITORY: 'Org/Name',
        RELEASE_VERSION: '1.0.0',
        RELEASE_STRATEGY: 'lol',
      }),
    ).toThrow(errorMessage);
  });
});
