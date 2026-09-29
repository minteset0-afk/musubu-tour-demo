const fs = require('node:fs');
fs.mkdirSync('vendor', { recursive: true });
fs.copyFileSync('node_modules/@supabase/supabase-js/dist/umd/supabase.js', 'vendor/supabase.js');
fs.copyFileSync('node_modules/@supabase/supabase-js/LICENSE', 'vendor/SUPABASE-LICENSE');
