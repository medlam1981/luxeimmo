const sharp = require('sharp');

async function convert() {
  try {
    await sharp('/root/.gemini/antigravity-cli/brain/178a1b86-37db-4aba-a2f3-4d4447973ddc/slide_4_hero_1784238709822.jpg')
      .webp({ quality: 80 })
      .toFile('public/images/hero/slide-4.webp');
    console.log('Image 4 converted successfully');
  } catch (err) {
    console.error('Error converting image:', err);
  }
}
convert();
