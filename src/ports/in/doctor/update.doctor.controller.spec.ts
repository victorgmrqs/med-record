import 'reflect-metadata';
import { prismaPlugin } from 'adapters/database/prisma/client';
import { doctorRoutes } from 'adapters/http/doctor.routes';
import { PrismaDoctorRepository } from 'application/repositories/doctor/doctor.repository';
import { IDoctorRepository } from 'application/repositories/doctor/doctor.repository.interface';
import Fastify from 'fastify';
import { container } from 'tsyringe';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Update Doctor - Integration Test', () => {
  const fastify = Fastify();

  beforeAll(async () => {
    container.registerSingleton<IDoctorRepository>('PrismaDoctorRepository', PrismaDoctorRepository);

    fastify.register(prismaPlugin);
    fastify.register(doctorRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('deve atualizar um doutor existente', async () => {
    const created = await fastify.inject({
      method: 'POST',
      url: '/',
      payload: { name: 'Old Name', email: 'test@example.com' },
    });

    expect(created.statusCode).toBe(201);

    const createdId = created.json().id;
    const response = await fastify.inject({
      method: 'PUT',
      url: `/${createdId}`,
      payload: { name: 'New Name' },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ id: createdId, name: 'New Name', email: 'test@example.com' });
  });

  it.skip('deve retornar 404 se o doutor não existir', async () => {
    const response = await fastify.inject({
      method: 'PUT',
      url: '/9999',
      payload: { name: 'Não Importa' },
    });
    expect(response.statusCode).toBe(404);
    expect(response.json().code).toBe('DOCTOR_NOT_FOUND');
  });
});
