import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function main() {
    const members = await prisma.organigrammaMember.findMany()
    console.log(JSON.stringify(members, null, 2))
}
main().catch(console.error)
