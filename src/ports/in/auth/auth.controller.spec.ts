import 'reflect-metadata';
import { AuthService } from 'adapters/auth/auth';
import { prismaPlugin } from 'adapters/database/prisma/client';
import routes from 'adapters/http/index.routes';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { CryptoHashRepository } from 'application/repositories/hash/crypto.repository';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { PrismaClient } from '@prisma/client';

describe('Auth Login Integration Test Suite', () => {
  const fastify = Fastify();
  const prisma = new PrismaClient();

  beforeAll(async () => {
    container.registerSingleton('DoctorRepository', PrismaDoctorRepository);
    container.registerSingleton('HashRepository', CryptoHashRepository);
    container.registerSingleton('AuthService', AuthService);
    fastify.register(prismaPlugin);
    fastify.register(routes);
    await fastify.ready();
  });

  afterAll(async () => {
    await prisma.doctor.deleteMany();
    await fastify.close();
    await prisma.$disconnect();
  });

  it('should return a token when valid credentials are provided', async () => {
    const doctorPayload = {
      name: 'Dr. Test',
      email: 'doctor@test.com',
      password: 'secret123',
    };

    const doctorResponse = await fastify.inject({
      method: 'POST',
      url: '/doctors',
      payload: doctorPayload,
    });
    expect(doctorResponse.statusCode).toBe(201);

    const loginPayload = {
      email: 'doctor@test.com',
      password: 'secret123',
    };

    const loginResponse = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: loginPayload,
    });
    expect(loginResponse.statusCode).toBe(200);
    const data = loginResponse.json();
    expect(data).toHaveProperty('token');
  });

  it('should return 401 when invalid credentials are provided', async () => {
    const loginPayload = {
      email: 'nonexistent@test.com',
      password: 'wrongpassword',
    };

    const loginResponse = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: loginPayload,
    });
    expect(loginResponse.statusCode).toBe(401);
    const data = loginResponse.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toMatch(/Invalid credentials/);
  });
});
