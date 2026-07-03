import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    const prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? [
            { emit: 'event', level: 'query' },
            { emit: 'stdout', level: 'error' },
            { emit: 'stdout', level: 'warn' },
        ] : ['error'],
    })

    if (process.env.NODE_ENV === 'development') {
        // @ts-ignore
        prisma.$on('query', (e: any) => {
            if (e.duration > 500) { // Log queries slower than 500ms
                console.warn(`Slow Query: ${e.query} (${e.duration}ms)`)
            }
        })
    }

    return prisma
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma