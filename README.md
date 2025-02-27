# AO Wallet Kit

React Hooks and Components for preconfigured and customizable interactions on AO.

<!-- toc -->

- [Supported wallets](#supported-wallets)
- [Installation](#installation)
- [Setup](#setup)
- [Config](#config)
  - [App config](#app-config)
    - [Available options](#available-options)
  - [Custom theme](#custom-theme)
    - [Available options](#available-options-1)
      - [Font](#font)
- [Terminology of Arweave Wallet Kit](#terminology-of-arweave-wallet-kit)
- [Connect Button](#connect-button)
  - [Usage](#usage)
  - [Config](#config-1)
- [Hooks](#hooks)
  - [`useConnection`](#useconnection)
    - [Usage](#usage-1)
  - [`useApi`](#useapi)
    - [Usage](#usage-2)
  - [`useProfileModal`](#useprofilemodal)
  - [`useActiveAddress`](#useactiveaddress)
    - [Usage](#usage-3)
  - [`usePublicKey`](#usepublickey)
    - [Usage](#usage-4)
  - [`usePermissions`](#usepermissions)
    - [Usage](#usage-5)
  - [`useAddresses`](#useaddresses)
    - [Usage](#usage-6)
  - [`useWalletNames`](#usewalletnames)
    - [Usage](#usage-7)
  - [`useStrategy`](#usestrategy)
    - [Usage](#usage-8)

<!-- tocstop -->

## Supported wallets

- [ArConnect](https://arconnect.io)
- [Arweave.app](https://arweave.app)
- [Metamask](https://metamask.io/)
- [Phantom](https://phantom.app/)
- Any wallet that injects the `window.ethereum` or `window.arweaveWallet` API (wagmi is used internally)
- Allows for custom strategies to be implemented so future integrations can be added!

## Installation

```sh
yarn add @project-kardeshev/ao-wallet-kit
```

or

```sh
npm i @project-kardeshev/ao-wallet-kit
```

## Setup

To use the library, you'll need to wrap your application with the Kit Provider.

```tsx
const App = () => {
  return (
    <AOWalletKit>
      <YourApp />
    </AOWalletKit>
  );
};
```

## Config

The Arweave Wallet Kit can be configured with information about your application and with a custom theme.

```tsx
...
  <AOWalletKit
    config={{
      permissions: ["ACCESS_ADDRESS"],
      ensurePermissions: true,
      ...
    }}
    theme={{
      accent: { r: 255, g: 0, b: 0 },
      ...
    }}
  >
    <YourApp />
  </AOWalletKit>
...
```

### App config

Using the `config` field of the `<AOWalletKit>` provider component, you can define a name, a logo or the required permissions for your app.

#### Available options

| Prop                | Type                                                                                  | Default             |                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------- |
| `permissions`       | [`PermissionType[]`](https://docs.arconnect.io/api/connect#permissions)               | `[]`                | Permissions to connect with.                                                                               |
| `ensurePermissions` | `boolean`                                                                             |  `false`            | Ensure that all required permissions are present. If false, it only checks if the app has any permissions. |
| `appInfo`           | [`AppInfo`](https://docs.arconnect.io/api/connect#additional-application-information) | `{}`                | Information about your app (name/logo).                                                                    |
| `gatewayConfig`     | `GatewayConfig`                                                                       | arweave.net gateway | Configuration for the Arweave gateway to use.                                                              |

### Custom theme

With the `theme` field, you can define a custom theme configuration for the Arweave Wallet Kit modals and buttons.

#### Available options

| Prop             | Type                               |                                                                        |
| ---------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| `displayTheme`   | `"dark"`, `"light"`                | UI display theme to use                                                |
| `accent`         | `RGBObject`                        | RGB accent color for the UI                                            |
| `titleHighlight` | `RGBObject`                        | RGB accent color for the subscreen titles (like the connection screen) |
| `radius`         | `"default"`, `"minimal"`, `"none"` | Border radius level used throughout the Kit UI                         |
| `font`           | `Font`                             | Including font family used throughout the Kit UI                       |

##### Font

The `font` field in the theme configuration allows you to specify the font family to be used throughout the Kit UI. It should be an object with a `fontFamily` property, which is a string representing the font family. If nothing is specified, the default font family is `Manrope` with a fallback to the next available sans-serif font in the system.

Here's an example of how to use it:

```tsx
...
<AOWalletKit
  theme={{
    font: {
      fontFamily: "Arial"
    },
    // other theme properties...
  }}
/>
...
```

## Terminology of Arweave Wallet Kit

Arweave Wallet Kit supports several _strategies_. The word **strategy means an implementation of a Wallet** in the Kit. These strategies allow the user to communicate with all wallets the same way and with the same API.

## Connect Button

To quickly integrate the Arweave Wallet Kit, you can use the `<ConnectButton>` component. It is a highly customizable button that supports displaying profile information about the connected wallet.

### Usage

```tsx
<ConnectButton
  accent="rgb(255, 0, 0)"
  profileModal={false}
  showBalance={true}
  ...
/>
```

### Config

You can configure the Connect Button through it's props.

| Props                | Type      |                                                                                         |
| -------------------- | --------- | --------------------------------------------------------------------------------------- |
| `accent`             | `string`  |  A theme color for the button                                                           |
| `showBalance`        | `boolean` | Show user balance when connected                                                        |
| `showProfilePicture` | `boolean` | Show user profile picture when connected                                                |
| `profileModal`       | `boolean` | Show profile modal on click (if disabled, clicking the button will disconnect the user) |

## Hooks

Inside the [`<AOWalletKit>`](#setup), you can use all kinds of hooks that are reactive to the different [strategies](#terminology-of-arweave-wallet-kit). Some of the hooks / api functions might not be supported by all wallets.

### `useConnection`

The core hook for connecting / disconnecting a [strategy](#terminology-of-arweave-wallet-kit).

#### Usage

```ts
const { connected, connect, disconnect } = useConnection();

// initiate connection
await connect();

// disconnect the connected strategy
await disconnect();

// is there a strategy connected?
connected ? 'wallet connected' : 'no connected wallet';
```

### `useApi`

API hook. Returns the active strategy's API as an interactable object. Can be used to sign/encrypt, etc.

**Some API functions might not be supported depending on the [strategy](#terminology-of-arweave-wallet-kit) the user chose. For example, Othent does not support the `signature()` function.** Make sure to verify beforehand.

#### Usage

```ts
const api = useApi();

// sign
await api.sign(transaction);

// encrypt
await api.encrypt(...)
```

### `useProfileModal`

Toggle / display a modal with profile information and a disconnect button.

```ts
const profileModal = useProfileModal();

profileModal.setOpen(true);
```

### `useActiveAddress`

Active address hook. Requires the `ACCESS_ADDRESS` and the `ACCESS_ALL_ADDRESSES` permission.

#### Usage

```ts
const address = useActiveAddress();
```

### `usePublicKey`

Active public key hook. Requires the `ACCESS_PUBLIC_KEY` permission.

#### Usage

```ts
const publicKey = usePublicKey();
```

### `usePermissions`

Permissions hook. Returns the permissions given to the app, known by Arweave Wallet Kit.

#### Usage

```ts
const permissions = usePermissions();
```

### `useAddresses`

All addresses hook. Returns the addresses in the connected wallet, known by Arweave Wallet Kit. Requires the `ACCESS_ALL_ADDRESSES` permission.

#### Usage

```ts
const addresses = useAddresses();
```

### `useWalletNames`

All addresses hook. Returns the addresses in the connected wallet, known by Arweave Wallet Kit. Requires the `ACCESS_ALL_ADDRESSES` permission. Note this is note available for Ethereum wallets.

#### Usage

```ts
const walletNames = useWalletNames();
```

### `useStrategy`

Active strategy hook. Returns the currently used strategy's ID.

#### Usage

```ts
const strategy = useStrategy();
```
