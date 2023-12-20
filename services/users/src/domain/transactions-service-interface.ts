export interface TransactionsServiceInterface {
  getBalance: (userId: string) => Promise<number>;
}
