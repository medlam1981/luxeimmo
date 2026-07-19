import translate from 'translate';
translate.engine = 'google';

async function translateChunked(html, to) {
  const chunks = html.split(/(<\/(?:p|h1|h2|h3|h4|h5|h6|ul|ol|li|div|blockquote)>)/gi);
  let translated = '';
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].trim() && !/^<\/(?:p|h1|h2|h3|h4|h5|h6|ul|ol|li|div|blockquote)>$/i.test(chunks[i])) {
      // It's content + opening tag or just content
      translated += await translate(chunks[i], { to });
    } else {
      // It's the closing tag or empty
      translated += chunks[i];
    }
  }
  return translated;
}

async function run() {
  try {
    const html = `<h1>The Legal Guide</h1><p>Buying property in Morocco is a great investment.</p><p>Second paragraph with <strong>bold</strong> text.</p>`;
    const res = await translateChunked(html, 'ar');
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
