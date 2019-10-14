import {
  Authenticator,
  ButtonStyle,
  Chain,
  UALAccountName,
  UALError,
  UALErrorType,
  UALLoggedInAuthType,
  User,
} from 'universal-authenticator-library'
import { CONSTANTS } from './constants'
import { LedgerOptions, Name } from './interfaces'
import { ledgerLogo } from './ledgerLogo'
import { LedgerUser } from './LedgerUser'
import { UALLedgerError } from './UALLedgerError'
import { SignatureProvider } from 'eosjs-ledger-signature-provider'
const signatureProvider = new SignatureProvider()

export class Ledger extends Authenticator {
  private onBoardingLink: string = CONSTANTS.onBoardingLink
  private users: LedgerUser[] = []
  public chains: Chain[]
  public options?: LedgerOptions

  /**
   * Ledger Constructor.
   *
   * @param chains
   * @param options { appName } appName is a optional to use Ledger
   */
  constructor(chains: Chain[], options?: LedgerOptions) {
    super(chains, options)
    this.chains = chains
  }

  private isMobile(): boolean {
    const userAgent = window.navigator.userAgent
    const isIOS = userAgent.includes('iPhone') || userAgent.includes('iPad')
    const isMobile = userAgent.includes('Mobile')
    const isAndroid = userAgent.includes('Android')
    const isCustom = userAgent.toLowerCase().includes('eoslynx')

    return isIOS || isMobile || isAndroid || isCustom
  }

  public async init(): Promise<void> {
    console.info('Ledger initialized!')
  }

  /**
   * Ledger will only work with ssl secured websites
   */
  public shouldRender(): boolean {
    if (window.location.protocol !== 'https:' || this.isMobile()) {
      return false
    }

    return true
  }

  public shouldAutoLogin(): boolean {
    return false
  }

  public async shouldRequestAccountName(): Promise<boolean> {
    return true
  }

  /**
   * Connect to the ledger and request Keys
   *
   * @param accountName Account Name is an optional paramter
   */

  public async getAvailableKeys( requestPermission: boolean = false, indexArray: number[] = [0])
  : Promise<string[]> {
    return await signatureProvider.getAvailableKeys(requestPermission, indexArray)
  }

  public async login(
    accountName?: string,
    addressIndex: number = 0,
    requestPermission: boolean = true,
    validate: boolean = true): Promise<User[]> {
    for (const chain of this.chains) {
      const user = new LedgerUser(chain, accountName, this.requiresGetKeyConfirmation(accountName) && requestPermission)
      await user.init(addressIndex)
      if (validate) {
        const isValid = await user.isAccountValid()
        if (!isValid) {
          const message = `Error logging into account "${accountName}"`
          const type = UALErrorType.Login
          const cause = null
          throw new UALLedgerError(message, type, cause)
        }
      }
      this.users.push(user)
    }

    return this.users
  }

  public async logout(): Promise<void> {
    try {
      for (const user of this.users) {
        user.signatureProvider.cleanUp()
        user.signatureProvider.clearCachedKeys()
      }
      this.users = []
    } catch (e) {
      const message = CONSTANTS.logoutMessage
      const type = UALErrorType.Logout
      const cause = e
      throw new UALLedgerError(message, type, cause)
    }
  }

  public getStyle(): ButtonStyle {
    return {
      icon: ledgerLogo,
      text: Name,
      textColor: CONSTANTS.white,
      background: CONSTANTS.ledgerGreen,
    }
  }

  public isLoading(): boolean {
    return false
  }

  public isErrored(): boolean {
    return false
  }

  public getError(): UALError | null {
    return null
  }

  public getOnboardingLink(): string {
    return this.onBoardingLink
  }

  public reset(): void {
    return
  }

  public requiresGetKeyConfirmation(accountName?: string): boolean {
    if (!accountName) {
      return true
    }

    const type = window.localStorage.getItem(UALLoggedInAuthType)
    const account = window.localStorage.getItem(UALAccountName)
    if (account === accountName && type === Name) {
      return false
    }

    return true
  }
}
