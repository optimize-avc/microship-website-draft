import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

const dir = 'C:/Users/tryst/clawd/presentations/microship-website/assets/images';

const images = [
  { url: 'https://microshipinc.com/wp-content/uploads/2023/09/microship-logo-450x150-1.webp', name: 'logo.webp' },
  { url: 'https://microshipinc.com/wp-content/uploads/2023/09/microship-white-logo-450x150-1.webp', name: 'logo-white.webp' },
  { url: 'https://microshipinc.com/wp-content/uploads/2023/03/MicroShip-Inc...-30-Years-In-Business-Graphic_v1.png', name: '30-years-badge.png' },
  { url: 'https://microshipinc.com/wp-content/uploads/elementor/thumbs/moving-and-storage-qrzaq95bn3kijawx1odrpth5u20xg9nz1aq1wpc5o8.webp', name: 'moving-storage.webp' },
  { url: 'https://microshipinc.com/wp-content/uploads/elementor/thumbs/affordable-qrzaq95bn3kijawx1odrpth5u20xg9nz1aq1wpc5o8.webp', name: 'affordable.webp' },
  { url: 'https://microshipinc.com/wp-content/uploads/elementor/thumbs/stress-free-moving-qrzaqa35txlsuwvjw6seab8mffwanyrpdfdjdzari0.webp', name: 'stress-free.webp' },
  { url: 'https://microshipinc.com/wp-content/uploads/elementor/thumbs/full-service-qrzaq95bn3kijawx1odrpth5u20xg9nz1aq1wpc5o8.webp', name: 'full-service.webp' },
  { url: 'https://microshipinc.com/wp-content/uploads/2023/09/padding-and-security.webp', name: 'padding-security.webp' },
];

async function download(url, name) {
  const filepath = path.join(dir, name);
  const mod = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    mod.get(url, {headers: {'User-Agent': 'Mozilla/5.0'}}, res => {
      if(res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, name).then(resolve).catch(reject);
      }
      const ws = fs.createWriteStream(filepath);
      res.pipe(ws);
      ws.on('finish', () => { ws.close(); console.log('✅ ' + name); resolve(); });
    }).on('error', e => { console.log('❌ ' + name + ': ' + e.message); reject(e); });
  });
}

for(const img of images) {
  await download(img.url, img.name).catch(() => {});
}
console.log('Done');
