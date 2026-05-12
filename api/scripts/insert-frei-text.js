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

(async () => {
  await mongoose.connect(process.env.DB_URL);
  const doc = await Text.create({
    page: 'SPENDEN',
    description: 'Amount chip: no preset (free amount)',
    EN: 'Any',
    DE: 'Frei',
    NL: 'Vrij',
  });
  console.log(JSON.stringify({ _id: doc._id.toString(), EN: doc.EN, DE: doc.DE, NL: doc.NL }));
  await mongoose.disconnect();
})();
