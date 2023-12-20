export class UserHashBalanceException extends Error {
  constructor() {
    super('User cannot be deleted because it has balance');
  }
}
