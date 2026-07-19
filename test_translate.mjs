import translate from 'translate';
translate.engine = 'google';
try {
  console.log(await translate('The legal guide to buying property in Morocco', { to: 'ar' }));
} catch (e) {
  console.error(e);
}
