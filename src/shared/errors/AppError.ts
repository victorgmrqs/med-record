class AppError {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly message: string;
  public readonly service: string;
  public readonly correlator: string;
  public readonly user_id: string;

  constructor(statusCode = 400, code: string, message: string, service: string, correlator?: string, user_id?: string) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.service = service;
    this.correlator = correlator || '';
    this.user_id = user_id || 'system';
  }
}

export default AppError;
