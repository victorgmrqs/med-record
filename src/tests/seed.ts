import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const doctor = await prisma.doctor.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  });
  // eslint-disable-next-line no-console
  console.log('Doctor created:', doctor);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
