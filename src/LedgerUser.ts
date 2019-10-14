import { Api, JsonRpc } from 'eosjs'
import { SignatureProvider } from 'eosjs-ledger-signature-provider'
import {
  TextDecoder as NodeTextDecoder,
  TextEncoder as NodeTextEncoder,
} from 'text-encoding'
import { Chain, SignTransactionResponse, UALErrorType, User } from 'universal-authenticator-library'

import { Name } from './interfaces'
import { UALLedgerError } from './UALLedgerError'

export class LedgerUser extends User {
  public signatureProvider: any
  private api: Api | null
  private rpc: JsonRpc | null
  private textEncoder: TextEncoder | NodeTextEncoder
  private textDecoder: TextDecoder | NodeTextDecoder

  constructor(
    private chain: Chain,
    private accountName: string,
    private requestPermission: boolean = false,
  ) {
    super()
    this.api = null
    this.rpc = null
    if (typeof(TextEncoder) !== 'undefined') {
      this.textEncoder = TextEncoder
      this.textDecoder = TextDecoder
    } else {
      this.textEncoder = NodeTextEncoder
      this.textDecoder = NodeTextDecoder
    }
  }

  public async init(addressIndex: number = 0) {
    this.signatureProvider = new SignatureProvider()
    this.signatureProvider.addressIndex = addressIndex
    const rpcEndpoint = this.chain.rpcEndpoints[0]
    const rpcEndpointString = `${rpcEndpoint.protocol}://${rpcEndpoint.host}:${rpcEndpoint.port}`
    this.rpc = new JsonRpc(rpcEndpointString)
    this.api = new Api({
      rpc: this.rpc,
      signatureProvider: this.signatureProvider,
      textEncoder: new this.textEncoder(),
      textDecoder: new this.textDecoder(),
    })
  }

  public async signTransaction(
    transaction: any,
    { broadcast = true, blocksBehind = 3, expireSeconds = 30 }
  ): Promise<SignTransactionResponse> {
    try {
      const completedTransaction = this.api && await this.api.transact(
        transaction,
        { broadcast, blocksBehind, expireSeconds }
      )
      return this.returnEosjsTransaction(broadcast, completedTransaction)
    } catch (e) {
      const message = e.message ? e.message : 'Unable to sign transaction'
      const type = UALErrorType.Signing
      const cause = e
      throw new UALLedgerError(message, type, cause)
    }
  }

  public async signArbitrary(): Promise<string> {
    throw new UALLedgerError(
      `${Name} does not currently support signArbitrary`,
      UALErrorType.Unsupported,
      null)
  }

  public async verifyKeyOwnership(_: string): Promise<boolean> {
    throw new UALLedgerError(
      `${Name} does not currently support verifyKeyOwnership`,
      UALErrorType.Unsupported,
      null)
  }

  public async getAccountName(): Promise<string> {
    return this.accountName
  }

  public async getChainId(): Promise<string> {
    return this.chain.chainId
  }

  public async getKeys(): Promise<string[]> {
    try {
      const keys = await this.signatureProvider.getAvailableKeys(this.requestPermission)
      return keys
    } catch (error) {
      const message = `Unable to getKeys for account ${this.accountName}.
        Please make sure your ledger device is connected and unlocked`
      const type = UALErrorType.DataRequest
      const cause = error
      throw new UALLedgerError(message, type, cause)
    }
  }

  public async isAccountValid(): Promise<boolean> {
    try {
      const account = this.rpc && await this.rpc.get_account(this.accountName)
      const actualKeys = this.extractAccountKeys(account)
      const authorizationKeys = await this.getKeys()

      return actualKeys.filter((key) => {
        return authorizationKeys.indexOf(key) !== -1
      }).length > 0
    } catch (e) {
      if (e.constructor.name === 'UALLedgerError') {
        throw e
      }

      const message = `Account validation failed for account ${this.accountName}.`
      const type = UALErrorType.Validation
      const cause = e
      throw new UALLedgerError(message, type, cause)
    }
  }

  private extractAccountKeys(account: any): string[] {
    const keySubsets = account.permissions.map((permission) => permission.required_auth.keys.map((key) => key.key))
    let keys = []
    for (const keySubset of keySubsets) {
      keys = keys.concat(keySubset)
    }
    return keys
  }
}
