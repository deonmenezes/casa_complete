
// exportAllCollections.js
const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = 'mongodb+srv://jaylulia20:cb28jfBC719EiUGt@cluster0.akrbkak.mongodb.net/casa_app?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'casa_app';

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const collections = await db.collections();

  for (const col of collections) {
    const data = await col.find({}).toArray();
    fs.writeFileSync(`${col.collectionName}.json`, JSON.stringify(data, null, 2));
    console.log(`✅ Exported ${col.collectionName}`);
  }

  await client.close();
})();
