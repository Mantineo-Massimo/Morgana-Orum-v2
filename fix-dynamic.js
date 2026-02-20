const fs = require('fs');
const files = [
    'app/[brand]/page.tsx',
    'app/[brand]/register/page.tsx',
    'app/[brand]/events/page.tsx',
    'app/[brand]/events/[id]/page.tsx',
    'app/[brand]/login/page.tsx',
    'app/[brand]/dashboard/page.tsx',
    'app/[brand]/dashboard/settings/page.tsx',
    'app/[brand]/dashboard/events/page.tsx',
    'app/[brand]/dashboard/support/page.tsx',
    'app/[brand]/dashboard/documents/page.tsx',
    'app/[brand]/about/page.tsx'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes('export const dynamic')) {
            // Find the last import statement
            const importsEnd = content.lastIndexOf('import ');
            if (importsEnd !== -1) {
                const afterImport = content.indexOf('\n', importsEnd) + 1;
                content = content.slice(0, afterImport) + '\nexport const dynamic = "force-dynamic"\n' + content.slice(afterImport);
                fs.writeFileSync(file, content);
                console.log(`Added force-dynamic to ${file}`);
            }
        }
    }
});
