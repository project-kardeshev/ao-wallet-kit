/** @type {Partial<import('typedoc').TypeDocOptions>} */

const config = {
  name: 'ao-wallet-kit',
  entryPointStrategy: 'expand',
  entryPoints: ['./src'],
  out: 'docs',
  // requires typedoc@0.25.0
  plugin: ['@rwsdatalab/typedoc-storybook-theme'],
  sourceLinkTemplate:
    'https://github.com/project-kardeshev/ao-wallet-kit/-/blob/{gitRevision}/{path}#L{line}',
  tsconfig: 'tsconfig.json',
  readme: './README.md',
  githubPages: false,
  exclude: ['**/node_modules/**/*', '**/dist/**/*'],
  skipErrorChecking: true,
};

export default config;
