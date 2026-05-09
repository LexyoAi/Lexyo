const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgIcon = (size) => {
  const rx = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.56);
  const textY = Math.round(size * 0.72);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${rx}" fill="url(#g)"/>
  <text x="${size / 2}" y="${textY}" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="900" fill="white" text-anchor="middle">L</text>
</svg>`;
};

async function main() {
  const dir = path.resolve(__dirname, '../public/icons');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const icons = [
    { size: 512, name: 'icon-512.png' },
    { size: 192, name: 'icon-192.png' },
    { size: 180, name: 'apple-touch-icon.png' },
  ];

  for (const { size, name } of icons) {
    await sharp(Buffer.from(svgIcon(size))).png().toFile(path.join(dir, name));
    console.log(`Creata: ${name} (${size}x${size})`);
  }
  console.log('Icone generate con successo!');
}

main().catch(console.error);
