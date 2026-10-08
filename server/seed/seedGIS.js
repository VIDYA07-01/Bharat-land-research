/**
 * GIS Region Seed Script
 * Run: node seed/seedGIS.js
 *
 * Seeds GISRegion documents for all demo states and districts.
 * ALL DATA IS SAMPLE/DEMO – NOT official government statistics.
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const GISRegion = require('../models/GISRegion');
const { stateRecords, districtRecords } = require('./gisData');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/bharat_land_portal';
  await mongoose.connect(uri);
  console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
};

const seed = async () => {
  await connectDB();

  // Wipe existing GIS region data
  await GISRegion.deleteMany({});
  console.log('🗑️  Cleared existing GISRegion documents');

  let created = 0;

  // Insert state-level records
  for (const record of stateRecords) {
    await GISRegion.create({
      ...record,
      isDemoData: true,
      source: 'Demo/Sample Data – Not official government statistics',
      dataYear: 2024,
    });
    console.log(`  ✅ State: ${record.state}`);
    created++;
  }

  // Insert district-level records
  for (const record of districtRecords) {
    await GISRegion.create({
      ...record,
      isDemoData: true,
      source: 'Demo/Sample Data – Not official government statistics',
      dataYear: 2024,
    });
    console.log(`  ✅ District: ${record.state} → ${record.district}`);
    created++;
  }

  console.log(`\n🎉 GIS Seed complete. Created ${created} GISRegion documents.`);
  console.log('  (States: ' + stateRecords.length + ', Districts: ' + districtRecords.length + ')');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ GIS Seed failed:', err.message);
  process.exit(1);
});
