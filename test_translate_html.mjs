import translate from 'translate';
translate.engine = 'google';

async function run() {
  try {
    const html = `<h1>The Legal Guide</h1><p>Buying property in Morocco is a great investment.</p>`;
    const res = await translate(html, { to: 'ar' });
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
