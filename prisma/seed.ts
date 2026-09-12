import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Alimentação', description: 'Despesas de alimentação', color: '#FFB703', icon: '🍽️', sortOrder: 1 },
    { name: 'Mercado', description: 'Supermercado', parentName: 'Alimentação', color: '#FFB703', icon: '🛒', sortOrder: 1 },
    { name: 'Restaurante', description: 'Restaurantes', parentName: 'Alimentação', color: '#FFB703', icon: '🍴', sortOrder: 2 },
    { name: 'Delivery', description: 'Delivery e apps', parentName: 'Alimentação', color: '#FFB703', icon: '🚚', sortOrder: 3 },
    { name: 'Padaria', description: 'Padarias', parentName: 'Alimentação', color: '#FFB703', icon: '🥐', sortOrder: 4 },
    { name: 'Transporte', description: 'Despesas de transporte', color: '#219EBC', icon: '🚗', sortOrder: 2 },
    { name: 'Combustível', description: 'Combustível', parentName: 'Transporte', color: '#219EBC', icon: '⛽', sortOrder: 1 },
    { name: 'Uber', description: 'Uber e transporte por aplicativo', parentName: 'Transporte', color: '#219EBC', icon: '🚕', sortOrder: 2 },
    { name: 'Estacionamento', description: 'Estacionamento', parentName: 'Transporte', color: '#219EBC', icon: '🅿️', sortOrder: 3 },
    { name: 'Manutenção', description: 'Manutenção de veículos', parentName: 'Transporte', color: '#219EBC', icon: '🔧', sortOrder: 4 },
    { name: 'Moradia', description: 'Despesas de moradia', color: '#8E9A9D', icon: '🏠', sortOrder: 3 },
    { name: 'Aluguel', description: 'Aluguel', parentName: 'Moradia', color: '#8E9A9D', icon: '🏢', sortOrder: 1 },
    { name: 'Condomínio', description: 'Condomínio', parentName: 'Moradia', color: '#8E9A9D', icon: '🏙️', sortOrder: 2 },
    { name: 'Energia', description: 'Energia elétrica', parentName: 'Moradia', color: '#8E9A9D', icon: '💡', sortOrder: 3 },
    { name: 'Água', description: 'Água', parentName: 'Moradia', color: '#8E9A9D', icon: '💧', sortOrder: 4 },
    { name: 'Internet', description: 'Internet e telefonia', parentName: 'Moradia', color: '#8E9A9D', icon: '📡', sortOrder: 5 },
    { name: 'Saúde', description: 'Despesas de saúde', color: '#2A9D8F', icon: '🩺', sortOrder: 4 },
    { name: 'Farmácia', description: 'Medicamentos', parentName: 'Saúde', color: '#2A9D8F', icon: '💊', sortOrder: 1 },
    { name: 'Consultas', description: 'Consultas médicas', parentName: 'Saúde', color: '#2A9D8F', icon: '🩺', sortOrder: 2 },
    { name: 'Exames', description: 'Exames e diagnósticos', parentName: 'Saúde', color: '#2A9D8F', icon: '🧪', sortOrder: 3 },
    { name: 'Lazer', description: 'Despesas de lazer', color: '#E76F51', icon: '🎉', sortOrder: 5 },
    { name: 'Streaming', description: 'Streaming e entretenimento', parentName: 'Lazer', color: '#E76F51', icon: '📺', sortOrder: 1 },
    { name: 'Jogos', description: 'Jogos e compras digitais', parentName: 'Lazer', color: '#E76F51', icon: '🎮', sortOrder: 2 },
    { name: 'Cinema', description: 'Cinema e entretenimento', parentName: 'Lazer', color: '#E76F51', icon: '🎬', sortOrder: 3 },
  ];

  for (const item of categories) {
    const parent = item.parentName
      ? await prisma.category.findFirst({ where: { name: item.parentName } })
      : null;

    await prisma.category.upsert({
      where: { id: `${item.name}-${parent?.id ?? 'root'}` },
      update: {},
      create: {
        id: `${item.name}-${parent?.id ?? 'root'}`,
        name: item.name,
        description: item.description,
        parentId: parent?.id,
        color: item.color,
        icon: item.icon,
        sortOrder: item.sortOrder,
      },
    });
  }

  await prisma.profile.upsert({
    where: { id: 'fixed-profile' },
    update: {},
    create: {
      id: 'fixed-profile',
      name: 'FIXED',
      description: 'Fixed expenses',
    },
  });

  await prisma.profile.upsert({
    where: { id: 'variable-profile' },
    update: {},
    create: {
      id: 'variable-profile',
      name: 'VARIABLE',
      description: 'Variable expenses',
    },
  });

  await prisma.profile.upsert({
    where: { id: 'recurring-profile' },
    update: {},
    create: {
      id: 'recurring-profile',
      name: 'RECURRING',
      description: 'Recurring revenues or expenses',
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
