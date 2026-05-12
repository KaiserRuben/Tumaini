// One-shot seed: insert bilingual text entries for the redesigned donate flow.
// Usage: node scripts/insert-donate-text.js
require('dotenv').config();
const mongoose = require('mongoose');

const TextSchema = new mongoose.Schema({
  page: { type: String, required: true },
  EN: String,
  NL: String,
  DE: String,
  description: String,
  created: { type: Date, default: Date.now },
});
const Text = mongoose.model('Text', TextSchema);

const entries = [
  { page: 'HEADER',  description: 'Donate button (nav)',          EN: 'Donate',                 DE: 'Spende',              NL: 'Doneren' },
  { page: 'SPENDEN', description: 'Bank details section title',   EN: 'Bank transfer',          DE: 'Bankverbindung',      NL: 'Bankoverdracht' },
  { page: 'SPENDEN', description: 'Recipient label',              EN: 'Recipient',              DE: 'Empfänger',           NL: 'Ontvanger' },
  { page: 'SPENDEN', description: 'Bank name label',              EN: 'Bank',                   DE: 'Bank',                NL: 'Bank' },
  { page: 'SPENDEN', description: 'IBAN label',                   EN: 'IBAN',                   DE: 'IBAN',                NL: 'IBAN' },
  { page: 'SPENDEN', description: 'BIC label',                    EN: 'BIC',                    DE: 'BIC',                 NL: 'BIC' },
  { page: 'SPENDEN', description: 'Reference / purpose label',    EN: 'Reference',              DE: 'Verwendungszweck',    NL: 'Omschrijving' },
  { page: 'SPENDEN', description: 'Copy button',                  EN: 'Copy',                   DE: 'Kopieren',            NL: 'Kopiëren' },
  { page: 'SPENDEN', description: 'Copied feedback',              EN: 'Copied',                 DE: 'Kopiert',             NL: 'Gekopieerd' },
  { page: 'SPENDEN', description: 'QR scan helper',               EN: 'Scan with your banking app', DE: 'Mit Banking-App scannen', NL: 'Scan met je bankapp' },
  { page: 'SPENDEN', description: 'Thank-you line above details', EN: 'Every contribution helps. Thank you.', DE: 'Jeder Beitrag hilft. Vielen Dank.', NL: 'Elke bijdrage helpt. Dank je wel.' },
];

(async () => {
  await mongoose.connect(process.env.DB_URL);
  const result = await Text.insertMany(entries);
  console.log(JSON.stringify(result.map(r => ({
    _id: r._id.toString(),
    page: r.page,
    description: r.description,
    EN: r.EN,
    DE: r.DE,
  })), null, 2));
  await mongoose.disconnect();
})();
