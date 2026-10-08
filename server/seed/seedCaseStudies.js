require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const CaseStudy = require('../models/CaseStudy');
const User = require('../models/User');
const CASE_STUDIES = require('./caseStudySeed');

const run = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/bharat_land_portal';
  await mongoose.connect(uri);
  console.log('✅ MongoDB connected');

  await CaseStudy.deleteMany({});
  console.log('🗑️  Cleared existing case studies');

  // Get an admin/researcher user to assign as uploadedBy
  let user = await User.findOne({ role: { $in: ['admin', 'researcher'] } });
  if (!user) {
    console.log('⚠️  No user found – creating placeholder');
    user = { _id: new mongoose.Types.ObjectId() };
  }

  let count = 0;
  for (const cs of CASE_STUDIES) {
    await CaseStudy.create({ ...cs, uploadedBy: user._id });
    console.log(`  ✅ ${cs.location.state} → ${cs.location.district}: ${cs.title.substring(0, 60)}…`);
    count++;
  }

  console.log(`\n🎉 Seeded ${count} case studies successfully`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
