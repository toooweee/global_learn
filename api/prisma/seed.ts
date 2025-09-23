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

  const directions = [
    'Информационные технологии',
    'Финансовые услуги',
    'Розничная торговля',
    'Производство и промышленность',
    'Строительство и недвижимость',
    'Здравоохранение и медицина',
    'Образование и тренинги',
    'Транспорт и логистика',
    'Гостиничный и ресторанный бизнес',
    'Маркетинг и реклама',
    'Электронная коммерция',
    'Сельское хозяйство',
    'Энергетика и возобновляемые источники',
    'Консалтинг и аудит',
    'Туризм и путешествия',
  ];

  for (const direction of directions) {
    await prisma.direction.upsert({
      where: {
        name: direction,
      },
      update: {
        name: direction,
      },
      create: {
        name: direction,
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
