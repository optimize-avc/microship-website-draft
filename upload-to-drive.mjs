import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const tokens = JSON.parse(fs.readFileSync('C:/Users/tryst/clawd/google-tokens.json', 'utf8'));
const creds = JSON.parse(fs.readFileSync('C:/Users/tryst/clawd/client_secret.json', 'utf8')).installed;
const oauth = new google.auth.OAuth2(creds.client_id, creds.client_secret, 'http://localhost:3456');
oauth.setCredentials(tokens);
const drive = google.drive({ version: 'v3', auth: oauth });

const dir = 'C:/Users/tryst/clawd/presentations/microship-website';

async function run() {
  // Create folder
  const folder = await drive.files.create({
    requestBody: { name: 'MicroShip Website Draft 2026', mimeType: 'application/vnd.google-apps.folder' },
    fields: 'id'
  });
  const folderId = folder.data.id;
  console.log('Folder: https://drive.google.com/drive/folders/' + folderId);

  // Upload all HTML files
  const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('fix-') && !f.includes('download-'));
  for (const f of htmlFiles) {
    await drive.files.create({
      requestBody: { name: f, parents: [folderId] },
      media: { mimeType: 'text/html', body: fs.createReadStream(path.join(dir, f)) },
      fields: 'id'
    });
    console.log('✅ ' + f);
  }

  // Upload images subfolder
  const imgDir = path.join(dir, 'assets/images');
  if (fs.existsSync(imgDir)) {
    const imgFolder = await drive.files.create({
      requestBody: { name: 'assets-images', mimeType: 'application/vnd.google-apps.folder', parents: [folderId] },
      fields: 'id'
    });
    const imgs = fs.readdirSync(imgDir);
    for (const img of imgs) {
      const ext = path.extname(img).toLowerCase();
      const mime = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';
      await drive.files.create({
        requestBody: { name: img, parents: [imgFolder.data.id] },
        media: { mimeType: mime, body: fs.createReadStream(path.join(imgDir, img)) },
        fields: 'id'
      });
      console.log('  🖼️ ' + img);
    }
  }

  console.log('\n📁 https://drive.google.com/drive/folders/' + folderId);
}

run().catch(e => console.error(e.message));
