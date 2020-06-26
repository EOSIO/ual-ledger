# UAL for Ledger Authenticator

*NOTE: Currently does not work in Chromium/Chrome due to a known U2F bug https://github.com/LedgerHQ/ledgerjs/issues/306*

This authenticator is meant to be used with [Ledger](https://www.ledger.com/) and [Universal Authenticator Library](https://github.com/EOSIO/universal-authenticator-library). When used in combination with them, it gives developers the ability to request transaction signatures through a Ledger device using the common UAL API.

![EOSIO Labs](https://img.shields.io/badge/EOSIO-Labs-5cb3ff.svg)

# About EOSIO Labs

EOSIO Labs repositories are experimental.  Developers in the community are encouraged to use EOSIO Labs repositories as the basis for code and concepts to incorporate into their applications. Community members are also welcome to contribute and further develop these repositories. Since these repositories are not supported by Block.one, we may not provide responses to issue reports, pull requests, updates to functionality, or other requests from the community, and we encourage the community to take responsibility for these.

## Supported Environments
- The Ledger Authenticator will only work with Desktop Browser Environments from sites with SSL (https) encryption

## Getting Started

```bash
# Using yarn
yarn add ual-ledger

# Using npm
npm install ual-ledger --save
```

#### Dependencies

* You must have the [eos app](https://support.ledger.com/hc/en-us/articles/360008913653) installed on your ledger device. You can download it to your device using [Ledger Live](https://www.ledger.com/pages/ledger-live), if you do not already have it.
* Use one of the UAL renderers below.

  * React - `ual-reactjs-renderer`

  * PlainJS - `ual-plainjs-renderer`

* An `HTTPS` connection is required

* Enable `Arbitrary Data` in the settings of your eos app

#### Basic Usage with React

```jsx
import { Ledger } from 'ual-ledger'
import { UALProvider, withUAL } from 'ual-reactjs-renderer'

const exampleNet = {
  chainId: '',
  rpcEndpoints: [{
    protocol: '',
    host: '',
    port: '',
  }]
}

const App = (props) => (
  <div>{JSON.stringify(props.ual)}</div>
)

const AppWithUAL = withUAL(App)

const ledger = new Ledger([exampleNet])

<UALProvider chains={[exampleNet]} authenticators={[ledger]}>
  <AppWithUAL />
</UALProvider>
```

## Known Limitations
* The eos app installed on your ledger device can only deserialize the data of certain actions. If you submit an unknown action, the ledger will only display the contract, action, and a hex string of the data. You can view the eos app here https://github.com/LedgerHQ/ledger-app-eos/.
* This libary has only been tested with the `Ledger Nano S`. 

## Contributing

[Contributing Guide](./CONTRIBUTING.md)

[Code of Conduct](./CONTRIBUTING.md#conduct)

## License

[MIT](./LICENSE)

## Important

See [LICENSE](./LICENSE) for copyright and license terms.

All repositories and other materials are provided subject to the terms of this [IMPORTANT](./IMPORTANT.md) notice and you must familiarize yourself with its terms.  The notice contains important information, limitations and restrictions relating to our software, publications, trademarks, third-party resources, and forward-looking statements.  By accessing any of our repositories and other materials, you accept and agree to the terms of the notice.
