export interface UseCase<RequestDto, ResponseDto> {
  execute: (requestDto: RequestDto) => Promise<ResponseDto>;
}
