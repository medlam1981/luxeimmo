const fs = require('fs');
const files = ['en.json', 'fr.json', 'es.json', 'ar.json'];

const texts = {
  en: "If you have any questions about this Privacy Policy, please reach out to us using the secure contact button below.",
  fr: "Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter en utilisant le bouton de contact sécurisé ci-dessous.",
  es: "Si tiene alguna pregunta sobre esta Política de Privacidad, comuníquese con nosotros utilizando el botón de contacto seguro a continuación.",
  ar: "إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا باستخدام زر الاتصال الآمن أدناه."
};

for (const file of files) {
  const path = `messages/${file}`;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const locale = file.split('.')[0];
  if (data.PrivacyPolicy && data.PrivacyPolicy.section6Text) {
    data.PrivacyPolicy.section6Text = texts[locale];
    fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
}
