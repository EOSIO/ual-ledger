import { Ledger } from './Ledger'

import { CONSTANTS } from './constants'
import { Name } from './interfaces'
import { ledgerLogo } from './ledgerLogo'

declare let window: any

// Make userAgent mutable for testing
Object.defineProperty(window.navigator, 'userAgent', ((val) => {
  return {
    get: () => val,
    set: (v) => {
      val = v
    }
  }
})(window.navigator.userAgent))

describe('Ledger', () => {
  let app
  const exampleNet = {
    chainId: '',
    rpcEndpoints: [{
      protocol: '',
      host: '',
      port: 0,
    }]
  }

  beforeEach(() => {
    app = new Ledger([exampleNet], { appName: 'My Test App' })
  })

  it('has a chains property', () => {
    expect(app.chains).toEqual([exampleNet])
  })

  it('has an init function', () => {
    expect(app.init).toBeDefined()
  })

  it('returns a style object', () => {
    expect(app.getStyle()).toEqual({
      icon: ledgerLogo,
      text: Name,
      textColor: CONSTANTS.white,
      background: CONSTANTS.ledgerGreen,
    })
  })

  it('returns an onboardingLink', () => {
    expect(app.getOnboardingLink()).toEqual(CONSTANTS.onBoardingLink)
  })

  it('has a working login method', async () => {
    const users = await app.login('theflash')
    expect(users).toHaveLength(1)
    expect(users[0].accountName).toEqual('theflash')
  })

  it('logsout correctly', async () => {
    await app.login('theflash')
    expect(app.users).toHaveLength(1)
    await app.logout()
    expect(app.users).toHaveLength(0)
  })

  it('throws a UALLedgerError if login is called with no accountname', async () => {
    await expect(app.login())
      .rejects
      .toThrow('Account validation failed for account undefined.')
  })

  describe('should render', () => {
    let desktopBrowser: string
    let mobileBrowser: string
    let embeddedBrowser: string

    beforeAll(() => {
      desktopBrowser = 'Chrome'
      mobileBrowser = 'iPhone'
      embeddedBrowser = 'EosLynx Android'
    })

    it('only on desktop', () => {
      window.navigator.userAgent = desktopBrowser
      expect(app.shouldRender()).toBe(true)
    })

    it('not on mobile', () => {
      window.navigator.userAgent = mobileBrowser
      expect(app.shouldRender()).toBe(false)
    })

    it('not in an embedded browser', () => {
      window.navigator.userAgent = embeddedBrowser
      expect(app.shouldRender()).toBe(false)
    })
  })
})
