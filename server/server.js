require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');

// Create upload directories if they don't exist
const uploadDirs = [
  'uploads',
  'uploads/documents',
  'uploads/images',
  'uploads/datasets',
];
uploadDirs.forEach((dir) => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Bharat Land Research & Governance Portal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Server running on  : http://localhost:${PORT}
📚 API Documentation  : http://localhost:${PORT}/api-docs
🔍 Health Check       : http://localhost:${PORT}/api/health
🌍 Environment        : ${process.env.NODE_ENV}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = server;
