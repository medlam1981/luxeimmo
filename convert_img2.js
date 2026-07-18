const sharp = require('sharp');

async function convert() {
  try {
    await sharp('/sdcard/Pictures/178048232761900.png')
      .webp({ quality: 80 })
      .toFile('public/images/hero/slide-2.webp');
    console.log('Image 2 converted successfully');
  } catch (err) {
    console.error('Error converting image:', err);
  }
}
convert();
