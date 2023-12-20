export interface UseCaseInterface<TRequest, TResponse> {
  execute: (props: TRequest) => Promise<TResponse>;
}
