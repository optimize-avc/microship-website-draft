import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const dir = 'C:/Users/tryst/clawd/presentations/microship-website';
const files = readdirSync(dir).filter(f => f.endsWith('.html'));

for (const f of files) {
  const path = join(dir, f);
  let html = readFileSync(path, 'utf8');
  
  // Add mobile CSS override before </style> or </head>
  const mobileCSS = `
@media(max-width:768px){.reveal,.service-card,.stat-item,.glass-card,.faq-item,.area-card,.blog-card,.review-card,.value-card,.step,.form-step{opacity:1!important;transform:none!important;filter:none!important;transition:none!important;animation:none!important}}
`;

  // Also add a noscript fallback
  const noscriptCSS = `<noscript><style>.reveal,.service-card,.stat-item,.glass-card,.faq-item,.area-card,.blog-card,.review-card,.value-card,.step,.form-step{opacity:1!important;transform:none!important}</style></noscript>`;

  // Insert mobile CSS before closing </style>
  if (html.includes('</style>')) {
    html = html.replace('</style>', mobileCSS + '</style>');
  }
  
  // Insert noscript before </head>
  if (html.includes('</head>') && !html.includes('<noscript>')) {
    html = html.replace('</head>', noscriptCSS + '\n</head>');
  }

  // Also add a fallback: auto-reveal after 2s
  const fallbackJS = `
setTimeout(()=>{document.querySelectorAll('.reveal').forEach(el=>{el.style.opacity='1';el.style.transform='none'})},2000);
`;
  if (html.includes('</body>')) {
    html = html.replace('</body>', '<script>' + fallbackJS + '</script>\n</body>');
  }

  writeFileSync(path, html);
  console.log('Fixed: ' + f);
}
