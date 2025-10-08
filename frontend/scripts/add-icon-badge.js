const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../assets');
const BADGE_CONFIG = {
  dev: {
    text: 'DEV',
    bgColor: '#FF0000',
    textColor: '#FFFFFF',
  },
  staging: {
    text: 'STG',
    bgColor: '#FFA500',
    textColor: '#FFFFFF',
  },
  beta: {
    text: 'BETA',
    bgColor: '#0000FF',
    textColor: '#FFFFFF',
  },
};

async function addBadgeToIcon(iconPath, outputPath, config) {
  try {
    const image = sharp(iconPath);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    // Dimensões do badge (ribbon no canto superior direito)
    const badgeHeight = Math.floor(height * 0.25);
    const badgeWidth = Math.floor(width * 0.6);
    const fontSize = Math.floor(badgeHeight * 0.5);

    // Criar SVG do badge (ribbon diagonal)
    const svg = `
      <svg width="${width}" height="${height}">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${config.bgColor};stop-opacity:0.95" />
            <stop offset="100%" style="stop-color:${config.bgColor};stop-opacity:0.85" />
          </linearGradient>
        </defs>
        <!-- Ribbon diagonal no canto superior direito -->
        <polygon points="${width - badgeWidth},0 ${width},0 ${width},${badgeHeight} ${width - badgeWidth + badgeHeight},${badgeHeight}" 
                 fill="url(#grad)" 
                 stroke="rgba(0,0,0,0.3)" 
                 stroke-width="2"/>
        <!-- Texto do badge -->
        <text x="${width - badgeWidth / 2 + badgeHeight / 2}" 
              y="${badgeHeight / 2}" 
              font-family="Arial, sans-serif" 
              font-size="${fontSize}" 
              font-weight="bold" 
              fill="${config.textColor}" 
              text-anchor="middle" 
              dominant-baseline="middle"
              transform="rotate(-45 ${width - badgeWidth / 2 + badgeHeight / 2} ${badgeHeight / 2})">
          ${config.text}
        </text>
      </svg>
    `;

    const badgeBuffer = Buffer.from(svg);

    // Combinar imagem original com badge
    await image
      .composite([
        {
          input: badgeBuffer,
          top: 0,
          left: 0,
        },
      ])
      .toFile(outputPath);

    console.log(`✅ Badge adicionado: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Erro ao processar ${iconPath}:`, error.message);
  }
}

async function removeBadge() {
  const files = ['icon.png', 'adaptive-icon.png'];

  for (const file of files) {
    const badgedPath = path.join(ASSETS_DIR, file.replace('.png', '-badged.png'));
    if (fs.existsSync(badgedPath)) {
      fs.unlinkSync(badgedPath);
      console.log(`🗑️  Badge removido: ${badgedPath}`);
    }
  }

  console.log('✅ Todos os badges foram removidos!');
}

async function addBadge(environment = 'dev') {
  const config = BADGE_CONFIG[environment] || BADGE_CONFIG.dev;

  console.log(`🎨 Adicionando badge "${config.text}" aos ícones...`);

  // Processar icon.png
  const iconPath = path.join(ASSETS_DIR, 'icon.png');
  const iconOutputPath = path.join(ASSETS_DIR, 'icon-badged.png');

  if (fs.existsSync(iconPath)) {
    await addBadgeToIcon(iconPath, iconOutputPath, config);
  } else {
    console.warn(`⚠️  Arquivo não encontrado: ${iconPath}`);
  }

  // Processar adaptive-icon.png
  const adaptiveIconPath = path.join(ASSETS_DIR, 'adaptive-icon.png');
  const adaptiveIconOutputPath = path.join(ASSETS_DIR, 'adaptive-icon-badged.png');

  if (fs.existsSync(adaptiveIconPath)) {
    await addBadgeToIcon(adaptiveIconPath, adaptiveIconOutputPath, config);
  } else {
    console.warn(`⚠️  Arquivo não encontrado: ${adaptiveIconPath}`);
  }

  console.log('\n✅ Badges criados com sucesso!');
  console.log('\n📝 Próximos passos:');
  console.log('   1. Atualize seu app.config.ts para usar os ícones com badge:');
  console.log('      icon: "./assets/icon-badged.png"');
  console.log('      android.adaptiveIcon.foregroundImage: "./assets/adaptive-icon-badged.png"');
  console.log('   2. Execute: npx expo prebuild --clean');
  console.log('   3. Execute: npm run android ou npm run ios\n');
}

// Processar argumentos da linha de comando
const args = process.argv.slice(2);
const command = args[0];
const environment = args[1] || 'dev';

if (command === 'remove') {
  removeBadge();
} else if (command === 'add' || !command) {
  addBadge(environment);
} else {
  console.log('Uso:');
  console.log('  node scripts/add-icon-badge.js add [dev|staging|beta]  - Adicionar badge');
  console.log('  node scripts/add-icon-badge.js remove                   - Remover badge');
}
