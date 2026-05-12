require('dotenv').config();
const mongoose = require('mongoose');

const TextSchema = new mongoose.Schema({
  page: { type: String, required: true },
  EN: String, NL: String, DE: String,
  description: String,
  created: { type: Date, default: Date.now },
});
const Text = mongoose.model('Text', TextSchema);

const entries = [
  { page: 'LANDING', description: 'Section eyebrow: mission/about',  EN: 'Mission',        DE: 'Mission',           NL: 'Missie' },
  { page: 'LANDING', description: 'Section eyebrow: latest report',  EN: 'Latest report',  DE: 'Aktueller Bericht', NL: 'Recentste verslag' },
];

(async () => {
  await mongoose.connect(process.env.DB_URL);
  const res = await Text.insertMany(entries);
  console.log(JSON.stringify(res.map(r => ({ _id: r._id.toString(), DE: r.DE, EN: r.EN, description: r.description })), null, 2));
  await mongoose.disconnect();
})();
