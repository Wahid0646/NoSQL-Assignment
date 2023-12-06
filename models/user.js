//const Sequelize = require('sequelize');

const getDB = require("../util/database").getDB;
const mongodb = require("mongodb");
//const sequelize = require('../util/database');
const db = require("../util/database").getDB;
class User {
  constructor(username, email) {
    (this.name = username), (this.email = email);
  }

/*const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING
});*/
save() {
  const db = getDB();
  db.collection("users").insertOne(this);
}

static findById(userId) {
  const db = getDB();
  return db
    .collection("users")
    .findOne({ _id: new mongodb.ObjectId(userId) })
    .then((user) => {
      return user;
    })
    .catch((err) => {
      console.log(err);
    });
}
}

module.exports = User;