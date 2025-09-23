import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const legalForms = [
    'ИП',
    'ООО',
    'АО',
    'Товарищество',
    'Кооператив',
    'Государственное предприятие',
    'Муниципальное предприятие',
  ];

  for (const legalForm of legalForms) {
    await prisma.companyLegalForm.upsert({
      where: {
        name: legalForm,
      },
      create: {
        name: legalForm,
      },
      update: {
        name: legalForm,
      },
    });
  }
}

main()
  .then(async () => {
    console.log('Database successfully seeded!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
