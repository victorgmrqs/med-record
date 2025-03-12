import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { IHashRepository } from './crypto.repository.interface';

const scrypt = promisify(_scrypt);

export class CryptoHashRepository implements IHashRepository {
  private readonly keyLength = 64;

  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, this.keyLength)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    const [salt, key] = hashed.split(':');
    const derivedKey = (await scrypt(password, salt, this.keyLength)) as Buffer;
    return key === derivedKey.toString('hex');
  }
}
