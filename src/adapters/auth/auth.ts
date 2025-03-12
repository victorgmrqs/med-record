import jwt from 'jsonwebtoken';

import { env } from '@infra/env';

export interface IAuthService {
  generateToken(payload: object): string;
  verifyToken(token: string): any;
}

export class AuthService {
  private expiresIn: number = env.JWT_EXPIRES_IN;
  private secret: string = env.JWT_SECRET;
  private algorithm: string = env.JWT_ALGORITHM;
  generateToken(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn, algorithm: this.algorithm as jwt.Algorithm });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.secret, { algorithms: [this.algorithm as jwt.Algorithm] });
  }
}
