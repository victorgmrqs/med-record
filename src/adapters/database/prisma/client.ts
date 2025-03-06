import { FastifyInstance } from 'fastify';

import logger from '@infra/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function connectPrisma() {
  await prisma.$connect();
  logger.info('Prisma connected to database.');
}

export async function disconnectPrisma() {
  await prisma.$disconnect();
  logger.info('Prisma disconnected from database.');
}

export const prismaPlugin = async (fastify: FastifyInstance) => {
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
};

export default prisma;
