import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { doctorRoutes } from 'adapters/http/doctor.routes';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { PrismaClient } from '@prisma/client';

describe('Delete Doctor - Integration Test', () => {
  const fastify = Fastify();
  const prisma = new PrismaClient();

  beforeAll(async () => {
    if (container.isRegistered('PrismaDoctorRepository')) {
      container.clearInstances();
    }

    container.registerSingleton<IDoctorRepository>('PrismaDoctorRepository', PrismaDoctorRepository);

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
    await prisma.$executeRaw`ALTER TABLE Doctor AUTO_INCREMENT = 1;`;
  });

  it('deve excluir um médico existente', async () => {
    // Criar um médico para teste
    const createResponse = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: { name: 'Doctor To Delete', email: 'delete@example.com' },
    });

    expect(createResponse.statusCode).toBe(201);

    const deleteResponse = await fastify.inject({
      method: 'DELETE',
      url: '/1',
    });

    expect(deleteResponse.statusCode).toBe(204);

    const getDoctorResponse = await fastify.inject({
      method: 'GET',
      url: '/1',
    });

    expect(getDoctorResponse.statusCode).toBe(404);
  });

  it('deve retornar 404 ao tentar excluir médico inexistente', async () => {
    const response = await fastify.inject({
      method: 'DELETE',
      url: '/9999',
    });

    expect(response.statusCode).toBe(404);
  });
});
