# UAL for Ledger Authenticator

This authenticator is meant to be used with [Ledger](https://www.ledger.com/) and [Universal Authenticator Library](https://github.com/EOSIO/universal-authenticator-library). When used in combination with them, it gives developers the ability to request transaction signatures through a Ledger device using the common UAL API.

## Supported Environments
- The Ledger Authenticator will only work with Desktop Browser Environments from sites with SSL (https) encryption

## Getting Started

```bash
# Using yarn
yarn add @blockone/ual-ledger

# Using npm
npm install @blockone/ual-ledger --save
```

#### Dependencies

* You must have the [eos app](https://support.ledger.com/hc/en-us/articles/360008913653) installed on your ledger device. You can download it to your device using [Ledger Live](https://www.ledger.com/pages/ledger-live), if you do not already have it.
* Use one of the UAL renderers below.

  * React - `@blockone/universal-authenticator-library-react-js-renderer`

  * Vanillajs - `@blockone/universal-authenticator-library-plain-js-renderer`

* An `HTTPS` connection is required

* Enable `Arbitrary Data` in the settings of your eos app

#### Basic Usage with React

```jsx
import { Ledger } from '@blockone/ual-ledger'
import { UALProvider, withUAL } from '@blockone/universal-authenticator-library-react-js-renderer'

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


## Contribution
Check out the [Contributing](./CONTRIBUTING.md) guide and please adhere to the [Code of Conduct](#)

## License
[MIT licensed](./LICENSE)

## Important

See LICENSE for copyright and license terms.  Block.one makes its contribution on a voluntary basis as a member of the EOSIO community and is not responsible for ensuring the overall performance of the software or any related applications.  We make no representation, warranty, guarantee or undertaking in respect of the software or any related documentation, whether expressed or implied, including but not limited to the warranties or merchantability, fitness for a particular purpose and noninfringement. In no event shall we be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or documentation or the use or other dealings in the software or documentation.  Any test results or performance figures are indicative and will not reflect performance under all conditions.  Any reference to any third party or third-party product, service or other resource is not an endorsement or recommendation by Block.one.  We are not responsible, and disclaim any and all responsibility and liability, for your use of or reliance on any of these resources. Third-party resources may be updated, changed or terminated at any time, so the information here may be out of date or inaccurate.
