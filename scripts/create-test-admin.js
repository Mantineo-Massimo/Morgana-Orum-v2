const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10)
    const email = 'testadmin_rbac@example.com'

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'SUPER_ADMIN',
            password: hashedPassword
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Test',
            surname: 'Admin',
            birthDate: new Date('1990-01-01'),
            matricola: 'TEST999',
            department: 'Scienze',
            degreeCourse: 'Informatica',
            isFuorisede: false,
            role: 'SUPER_ADMIN',
            association: 'Morgana & O.R.U.M.'
        }
    })
    console.log(`Test Super Admin created/updated: ${user.email}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
