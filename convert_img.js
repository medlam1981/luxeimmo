const sharp = require('sharp');
const fs = require('fs');

async function convert() {
  try {
    await sharp('/sdcard/Pictures/17804232761900.png')
      .webp({ quality: 80 })
      .toFile('public/images/hero/slide-1.webp');
    console.log('Image converted successfully');
  } catch (err) {
    console.error('Error converting image:', err);
  }
}
convert();
