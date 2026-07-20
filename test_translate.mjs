import translate from 'translate';

translate.engine = 'google';

async function translateChunked(html, to) {
  const chunks = html.split(/(<[^>]+>)/g);
  let translated = '';
  for (let i = 0; i < chunks.length; i++) {
    // Even indices are text nodes
    if (i % 2 === 0) {
      if (chunks[i].trim()) {
        translated += await translate(chunks[i], { to });
      } else {
        translated += chunks[i]; // preserve spaces/newlines
      }
    } else {
      translated += chunks[i]; // preserve HTML tags exactly
    }
  }
  return translated;
}

async function test() {
  const text = '<p>Hello <b>World</b></p>';
  const res = await translateChunked(text, 'ar');
  console.log('Result:', res);
}

test();
