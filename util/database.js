const mongoDB = require("mongodb");
const MongoClient = mongoDB.MongoClient;

let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://wahidshaik0646:wahid%400646@cluster0.zboycqh.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDB = () => {
  if (_db) {
    return _db;
  } else {
    throw "No database found";
  }
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;