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
  { page: 'LANDING', description: 'Donation section eyebrow (Landing)', EN: 'Donate',           DE: 'Spende',           NL: 'Doneren' },
  { page: 'LANDING', description: 'Donation section title (Landing)',   EN: 'How you can help', DE: 'So können Sie helfen', NL: 'Hoe je kunt helpen' },
  { page: 'LANDING', description: 'Donation card CTA (Landing)',        EN: 'Learn more',       DE: 'Mehr erfahren',    NL: 'Meer info' },
];

(async () => {
  await mongoose.connect(process.env.DB_URL);
  const res = await Text.insertMany(entries);
  console.log(JSON.stringify(res.map(r => ({ _id: r._id.toString(), DE: r.DE, EN: r.EN, description: r.description })), null, 2));
  await mongoose.disconnect();
})();
