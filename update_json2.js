const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const locales = {
  en: {
    Admin: { ownerPhone: "Owner Phone Number" },
    Property: { ratingSuccess: "Thank you for your rating!", rateExperience: "Did you successfully contact the owner? Please rate your experience with our platform.", submit: "Submit" }
  },
  ar: {
    Admin: { ownerPhone: "رقم هاتف المالك" },
    Property: { ratingSuccess: "شكرا لتقييمك!", rateExperience: "هل تمكنت من التواصل مع المالك بنجاح؟ يرجى تقييم تجربتك مع منصتنا.", submit: "إرسال" }
  },
  fr: {
    Admin: { ownerPhone: "Numéro de téléphone du propriétaire" },
    Property: { ratingSuccess: "Merci pour votre évaluation !", rateExperience: "Avez-vous réussi à contacter le propriétaire ? Veuillez évaluer votre expérience avec notre plateforme.", submit: "Soumettre" }
  },
  es: {
    Admin: { ownerPhone: "Número de teléfono del propietario" },
    Property: { ratingSuccess: "¡Gracias por su calificación!", rateExperience: "¿Logró contactar al propietario con éxito? Por favor califique su experiencia con nuestra plataforma.", submit: "Enviar" }
  }
};

for (const [lang, translations] of Object.entries(locales)) {
  const file = path.join(messagesDir, `${lang}.json`);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!data.Admin) data.Admin = {};
    if (!data.Property) data.Property = {};
    data.Admin = { ...data.Admin, ...translations.Admin };
    data.Property = { ...data.Property, ...translations.Property };
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json`);
  }
}
