import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.whatsAppGroup.groupBy({
        by: ['category'],
        _count: true
    });
    console.log(categories);

    const depts = await prisma.whatsAppGroup.groupBy({
        by: ['department'],
        _count: true
    });
    console.log(depts);
}

main();
