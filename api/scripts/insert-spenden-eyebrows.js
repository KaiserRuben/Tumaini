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
  { page: 'SPENDEN', description: 'Eyebrow: on the ground', EN: 'On the ground', DE: 'Vor Ort',  NL: 'Ter plaatse' },
  { page: 'SPENDEN', description: 'Eyebrow: projects',      EN: 'Projects',      DE: 'Projekte', NL: 'Projecten' },
  { page: 'SPENDEN', description: 'Amount label',           EN: 'Amount',        DE: 'Betrag',   NL: 'Bedrag' },
];

(async () => {
  await mongoose.connect(process.env.DB_URL);
  const res = await Text.insertMany(entries);
  console.log(JSON.stringify(res.map(r => ({ _id: r._id.toString(), DE: r.DE, EN: r.EN, NL: r.NL, description: r.description })), null, 2));
  await mongoose.disconnect();
})();
