import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { doctorRoutes } from 'adapters/http/doctor.routes';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { PrismaClient } from '@prisma/client';

container.registerSingleton<IDoctorRepository>('PrismaDoctorRepository', PrismaDoctorRepository);

describe('Get all doctors Suite test - Integration', () => {
  const fastify = Fastify();
  const prisma = new PrismaClient();

  beforeAll(async () => {
    fastify.register(prismaPlugin);
    fastify.register(doctorRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await prisma.doctor.deleteMany();
    await fastify.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.doctor.deleteMany();

    // Resetar o autoincrement para 1
    await prisma.$executeRaw`ALTER TABLE Doctor AUTO_INCREMENT = 1;`;
  });

  it('should create a doctor and get all doctors', async () => {
    await fastify.inject({
      method: 'POST',
      url: '/',
      payload: { name: 'John Doe', email: 'email@email.com' },
    });

    const response = await fastify.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([{ id: 1, name: 'John Doe', email: 'email@email.com' }]);
  });

  it('should return an empty array when no doctors are present', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });
  // TODO: check this test
  it.skip('should handle errors when getting doctors if there is a server error', async () => {
    vi.spyOn(prisma.doctor, 'findMany').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    const response = await fastify.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(500);
  });
});
