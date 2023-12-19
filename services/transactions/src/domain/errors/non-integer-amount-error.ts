export class NonIntegerAmountError extends Error {
  constructor() {
    super('Amount must be an integer');
  }
}
