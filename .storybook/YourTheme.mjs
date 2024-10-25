import { create } from '@storybook/theming';

export default create({
  base: 'dark',
  brandTitle: 'AO Wallet Kit',
  brandUrl: 'https://ao-wallet-kit_project-kardeshev.arweave.net',
  brandImage: 'https://arweave.net/oDSg_8Qmy8nHOgtS_77cxFTq3oytZ7TBbu0ntGv3Xas',
  brandTarget: '_self',

    //
  colorPrimary: '#1CA051',
  colorSecondary: '#6CC790',
 
  // UI
  appBg: '#1f1f1f',
  appContentBg: '#1f1f1f',
  appPreviewBg: '#1f1f1f',
  appBorderColor: '#585C6D',
  appBorderRadius: 4,
 
  // Text colors
  textColor: '#1CA051',
  textInverseColor: '#6CC790',
 
  // Toolbar default and active colors
  barTextColor: '#9E9E9E',
  barSelectedColor: '#585C6D',
  barHoverColor: '#585C6D',
  barBg: '#1f1f1f',
 
  // Form colors
  inputBg: '#1f1f1f',
  inputBorder: '#6CC790',
  inputTextColor: '#6CC790',
  inputBorderRadius: 2,
});