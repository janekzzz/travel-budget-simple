const mongo = require('mongodb').MongoClient;
const url = `mongodb+srv://jan:Y4wCYBfSoQIQZ4a0@cluster0-zjyqa.mongodb.net/test?retryWrites=true&w=majority`;
//const db = client.db('travelbudget');

mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('connected?')
  const db = client.db('travelbudget');
  const collection = db.collection('expenses');
  collection.find().toArray((err, items) => {
    console.log(items)
  })
})


