const fs = require('fs');
const files = [
    'app/actions/users.ts',
    'app/actions/auth.ts',
    'app/actions/news.ts',
    'app/actions/representatives.ts',
    'app/[brand]/admin/page.tsx',
    'app/[brand]/admin/news/[id]/edit/page.tsx',
    'app/[brand]/admin/representatives/[id]/edit/page.tsx'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        if (content.includes('import { PrismaClient } from "@prisma/client"')) {
            content = content.replace('import { PrismaClient } from "@prisma/client"', 'import prisma from "@/lib/prisma"');
            modified = true;
        }

        if (content.includes('const prisma = new PrismaClient()')) {
            content = content.replace('const prisma = new PrismaClient()\n', '');
            content = content.replace('const prisma = new PrismaClient()', '');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(file, content);
            console.log(`Fixed prisma import in ${file}`);
        }
    }
});
