import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');
const SRC = path.join(ROOT, 'src');

// Helper: recursive copy
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper: replace imports in all .jsx/.js files in a directory
function fixImports(dir, replacements) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixImports(fullPath, replacements);
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      for (const [from, to] of replacements) {
        if (content.includes(from)) {
          content = content.replaceAll(from, to);
          changed = true;
        }
      }
      if (changed) fs.writeFileSync(fullPath, content);
    }
  }
}

console.log('=== Restructuring CodeArena into client/ admin/ server/ ===\n');

// ============ 1. CREATE CLIENT APP ============
console.log('1. Creating client/ app...');
const CLIENT = path.join(ROOT, 'client');
fs.mkdirSync(path.join(CLIENT, 'src'), { recursive: true });

// Copy frontend pages, layouts, routes
copyDir(path.join(SRC, 'frontend', 'pages'), path.join(CLIENT, 'src', 'pages'));
copyDir(path.join(SRC, 'frontend', 'layouts'), path.join(CLIENT, 'src', 'layouts'));
copyDir(path.join(SRC, 'frontend', 'components'), path.join(CLIENT, 'src', 'components'));
copyDir(path.join(SRC, 'frontend', 'hooks'), path.join(CLIENT, 'src', 'hooks'));

// Copy shared items into client
copyDir(path.join(SRC, 'shared', 'services'), path.join(CLIENT, 'src', 'services'));
copyDir(path.join(SRC, 'shared', 'context'), path.join(CLIENT, 'src', 'context'));
copyDir(path.join(SRC, 'shared', 'constants'), path.join(CLIENT, 'src', 'constants'));
copyDir(path.join(SRC, 'shared', 'utils'), path.join(CLIENT, 'src', 'utils'));
copyDir(path.join(SRC, 'shared', 'components', 'ui'), path.join(CLIENT, 'src', 'components', 'ui'));
copyDir(path.join(SRC, 'shared', 'components', 'shared'), path.join(CLIENT, 'src', 'components', 'shared'));

// Copy ProtectedRoute
const prSrc = path.join(SRC, 'shared', 'components', 'ProtectedRoute.jsx');
if (fs.existsSync(prSrc)) {
  fs.mkdirSync(path.join(CLIENT, 'src', 'components'), { recursive: true });
  fs.copyFileSync(prSrc, path.join(CLIENT, 'src', 'components', 'ProtectedRoute.jsx'));
}

// Copy public assets
copyDir(path.join(ROOT, 'public'), path.join(CLIENT, 'public'));

// Copy index.css
fs.copyFileSync(path.join(SRC, 'index.css'), path.join(CLIENT, 'src', 'index.css'));

// Fix imports in client: @shared/xxx -> @/xxx, @frontend/xxx -> @/xxx
fixImports(path.join(CLIENT, 'src'), [
  ['@shared/components/ui/', '@/components/ui/'],
  ['@shared/components/shared/', '@/components/shared/'],
  ['@shared/components/ProtectedRoute', '@/components/ProtectedRoute'],
  ['@shared/services/', '@/services/'],
  ['@shared/context/', '@/context/'],
  ['@shared/constants/', '@/constants/'],
  ['@shared/utils/', '@/utils/'],
  ['@frontend/layouts/', '@/layouts/'],
  ['@frontend/pages/', '@/pages/'],
  ['@frontend/components/', '@/components/'],
]);

console.log('   ✅ client/src/ populated');

// ============ 2. CREATE ADMIN APP ============
console.log('2. Creating admin/ app...');
const ADMIN = path.join(ROOT, 'admin');
fs.mkdirSync(path.join(ADMIN, 'src'), { recursive: true });

// Copy admin pages, layouts, components, hooks
copyDir(path.join(SRC, 'admin', 'pages'), path.join(ADMIN, 'src', 'pages'));
copyDir(path.join(SRC, 'admin', 'layouts'), path.join(ADMIN, 'src', 'layouts'));
copyDir(path.join(SRC, 'admin', 'components'), path.join(ADMIN, 'src', 'components'));
copyDir(path.join(SRC, 'admin', 'hooks'), path.join(ADMIN, 'src', 'hooks'));
copyDir(path.join(SRC, 'admin', 'routes'), path.join(ADMIN, 'src', 'routes'));

// Copy shared items into admin
copyDir(path.join(SRC, 'shared', 'services'), path.join(ADMIN, 'src', 'services'));
copyDir(path.join(SRC, 'shared', 'context'), path.join(ADMIN, 'src', 'context'));
copyDir(path.join(SRC, 'shared', 'constants'), path.join(ADMIN, 'src', 'constants'));
copyDir(path.join(SRC, 'shared', 'utils'), path.join(ADMIN, 'src', 'utils'));
copyDir(path.join(SRC, 'shared', 'components', 'ui'), path.join(ADMIN, 'src', 'components', 'ui'));
copyDir(path.join(SRC, 'shared', 'components', 'shared'), path.join(ADMIN, 'src', 'components', 'shared'));

// Copy ProtectedRoute
if (fs.existsSync(prSrc)) {
  fs.copyFileSync(prSrc, path.join(ADMIN, 'src', 'components', 'ProtectedRoute.jsx'));
}

// Copy public assets
copyDir(path.join(ROOT, 'public'), path.join(ADMIN, 'public'));

// Copy index.css
fs.copyFileSync(path.join(SRC, 'index.css'), path.join(ADMIN, 'src', 'index.css'));

// Fix imports in admin: @shared/xxx -> @/xxx, @admin/xxx -> @/xxx
fixImports(path.join(ADMIN, 'src'), [
  ['@shared/components/ui/', '@/components/ui/'],
  ['@shared/components/shared/', '@/components/shared/'],
  ['@shared/components/ProtectedRoute', '@/components/ProtectedRoute'],
  ['@shared/services/', '@/services/'],
  ['@shared/context/', '@/context/'],
  ['@shared/constants/', '@/constants/'],
  ['@shared/utils/', '@/utils/'],
  ['@admin/components/', '@/components/'],
  ['@admin/hooks/', '@/hooks/'],
  ['@admin/layouts/', '@/layouts/'],
  ['@admin/pages/', '@/pages/'],
  ['@admin/routes/', '@/routes/'],
]);

console.log('   ✅ admin/src/ populated');

console.log('\n=== File copy & import rewrite done! ===');
console.log('Next: Create entry files (App.jsx, main.jsx, index.html, vite.config.js, package.json) for each app.');
