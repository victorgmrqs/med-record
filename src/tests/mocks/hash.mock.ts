import { IHashRepository } from 'application/repositories/hash/crypto.repository.interface';
import { vi } from 'vitest';

export const mockHashRepository: IHashRepository = {
  hash: vi.fn(),
  compare: vi.fn(),
};
