import prisma from '../src/prisma/client.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Start seeding...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  const salaryCategory = await prisma.category.create({
    data: {
      name: 'Salary',
      type: 'INCOME',
      userId: user.id,
    },
  });

  const foodCategory = await prisma.category.create({
    data: {
      name: 'Food',
      type: 'EXPENSE',
      userId: user.id,
    },
  });

  await prisma.transaction.create({
    data: {
      amount: 5000,
      description: 'Monthly Salary',
      date: new Date(),
      type: 'INCOME',
      categoryId: salaryCategory.id,
      userId: user.id,
    },
  });

  await prisma.transaction.create({
    data: {
      amount: 50,
      description: 'Groceries',
      date: new Date(),
      type: 'EXPENSE',
      categoryId: foodCategory.id,
      userId: user.id,
    },
  });

  await prisma.budget.create({
    data: {
      limitAmount: 500,
      spentAmount: 50,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      categoryId: foodCategory.id,
      userId: user.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
