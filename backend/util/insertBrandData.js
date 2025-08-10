const mongoose = require('mongoose');
const Brand = require('../models/brand');

// MongoDB connection
mongoose.connect('mongodb+srv://jaylulia20:cb28jfBC719EiUGt@cluster0.akrbkak.mongodb.net/casa_app?retryWrites=true&w=majority&appName=Cluster0');

const brandData = require('./dumy_brand.json');

async function insertBrands() {
  try {
    for (const item of brandData) {
      // Clean logo_url in case it's an array
      const logoUrl = Array.isArray(item.logo_url) ? item.logo_url[0] : item.logo_url;

      // Check if brand exists
      let brandDoc = await Brand.findOne({ name: item.brand });
      if (!brandDoc) {
        await Brand.create({
          name: item.brand,
          logo_url: logoUrl,
        });
        console.log(`✅ Inserted brand: ${item.brand}`);
      } else {
        console.log(`⚠️ Brand already exists: ${item.brand}`);
      }
    }

    console.log('🎉 All brand data inserted!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error inserting brands:', err);
    mongoose.disconnect();
  }
}

insertBrands();
