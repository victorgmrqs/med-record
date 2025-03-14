interface IBaseAuthRequest {
  email: string;
  password: string;
}

interface IAithResponse {
  token: string;
}

export type AuthRequestDTO = IBaseAuthRequest;
export type AuthResponseDTO = IAithResponse;
