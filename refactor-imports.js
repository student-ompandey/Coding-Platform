import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function refactorImports() {
  const srcDir = path.resolve('./src');
  
  walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      let changed = false;

      const replaces = [
        ['@/components/ui', '@shared/components/ui'],
        ['@/components/shared', '@shared/components/shared'],
        ['@/lib/utils', '@shared/utils/utils'],
        ['@/data/dummyData', '@shared/constants/dummyData'],
        ['@/components/dashboard', '@admin/components/dashboard'],
        ['@/components/layout', '@admin/layouts'],
        ['@/pages', '@admin/pages'],
        ['@/hooks', '@admin/hooks']
      ];

      for (let [search, replace] of replaces) {
        if (content.includes(search)) {
          content = content.split(search).join(replace);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated imports in ${filePath}`);
      }
    }
  });
}

refactorImports();
