import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const reps = await prisma.representative.findMany({
    where: { listName: "O.R.U.M.", category: "CENTRAL" }
  })
  console.log("Reps found:", reps.length)
  console.log(reps.map(r => r.name))
}
main().catch(console.error).finally(() => prisma.$disconnect())
