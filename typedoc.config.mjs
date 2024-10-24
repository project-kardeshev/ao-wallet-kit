/** @type {Partial<import('typedoc').TypeDocOptions>} */

const config = {
  entryPoints: ['./src/index.ts', './src/secondary-entry.ts'],
  out: 'doc',
};

export default config;
