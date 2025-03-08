class AppError {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly message: string;
  public readonly service: string;

  constructor(statusCode = 400, code: string, message: string, service: string, correlator?: string, user_id?: string) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.service = service;
  }
}

export default AppError;
