const mongoose = require('mongoose');
require('dotenv').config(); // Ensure .env is loaded

const User = require('../models/user'); // ✅ Correct model name

const userData = require('./dummy_users.json'); // ✅ Correct JSON file

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => {
  console.error('🔴 MongoDB connection error:', err);
  process.exit(1);
});

async function insertUsers() {
  try {
    for (const item of userData) {
      const existing = await User.findOne({ email: item.email });
      if (!existing) {
        await User.create(item);
        console.log(`✅ Inserted user: ${item.email}`);
      } else {
        console.log(`⚠️ User already exists: ${item.email}`);
      }
    }

    console.log('🎉 All users inserted!');
  } catch (err) {
    console.error('❌ Error inserting users:', err);
  } finally {
    mongoose.disconnect();
  }
}

insertUsers();
