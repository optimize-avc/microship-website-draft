import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const dir = 'C:/Users/tryst/clawd/presentations/microship-website';
const files = readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('fix-') && !f.includes('download-') && !f.includes('upload-'));

// Add Playfair Display to the Google Fonts link and inline critical premium overrides
for (const f of files) {
  const path = join(dir, f);
  let html = readFileSync(path, 'utf8');
  
  // 1. Add Playfair Display to Google Fonts link if not already there
  if (!html.includes('Playfair+Display')) {
    html = html.replace(
      /family=Plus\+Jakarta\+Sans[^"&]*/,
      '$&&family=Playfair+Display:wght@400;600;700;800'
    );
  }
  
  // 2. Inject critical premium overrides INSIDE the <style> tag (higher specificity)
  const criticalCSS = `
/* === PREMIUM OVERRIDES === */
h1,h2{font-family:'Playfair Display',Georgia,serif!important}
.hero h1,.page-hero h1{font-size:clamp(2.5rem,6vw,5rem)!important;letter-spacing:-2px}
body{font-weight:300}
.section-label{letter-spacing:4px!important;font-size:.75rem!important;font-weight:700!important}
body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");background-repeat:repeat;background-size:256px}
.glass-card{box-shadow:0 1px 2px rgba(0,0,0,.07),0 4px 8px rgba(0,0,0,.07),0 16px 32px rgba(0,0,0,.07)!important;border:1px solid rgba(255,255,255,.08)}
@media(min-width:769px){.glass-card:hover{transform:translateY(-8px) rotate(.5deg)!important;box-shadow:0 2px 4px rgba(0,0,0,.1),0 8px 16px rgba(0,0,0,.1),0 24px 48px rgba(0,0,0,.12)!important}}
@media(max-width:768px){h1{font-size:clamp(2rem,8vw,3rem)!important}h2{font-size:clamp(1.5rem,5vw,2.2rem)!important}body::after{opacity:.02}}
`;

  // Insert before closing </style>
  if (!html.includes('PREMIUM OVERRIDES')) {
    html = html.replace('</style>', criticalCSS + '\n</style>');
  }
  
  writeFileSync(path, html);
  console.log('✅ ' + f);
}
