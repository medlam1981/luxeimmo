const sharp = require('sharp');

async function convert() {
  try {
    await sharp('/sdcard/Pictures/1780e48232761900.png')
      .webp({ quality: 80 })
      .toFile('public/images/hero/slide-3.webp');
    console.log('Image 3 converted successfully');
  } catch (err) {
    console.error('Error converting image:', err);
  }
}
convert();
