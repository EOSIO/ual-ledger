/* eslint max-classes-per-file: 0 */
export class Api {
  public transact = jest.fn().mockImplementation(async () => {
    return {
      transaction_id: 'testid',
      processed: {
        receipt: {
          status: 'complete',
        }
      }
    }
  })
}

export class JsonRpc {
  public get_account = jest.fn().mockImplementation(async (account) => {
    if (!account) {
      throw Error('No accountName provided')
    }

    return {
      permissions: [{
        required_auth: {
          keys: [{
            key: 'EOS11111',
          }],
        }
      }],
    }
  })
}
