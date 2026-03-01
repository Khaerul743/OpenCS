type StatusResponse = "success" | "error" | "fail"

interface BaseResponse {
  status: StatusResponse
  message: string
}

export interface ErrorResponse extends BaseResponse {
  status: "error" | "fail"
  code: string
}

export interface SuccessResponse<T> extends BaseResponse {
  status: "success"
  data: T
}