//const Sequelize = require('sequelize');

const getDB = require("../util/database").getDB;
const mongodb = require("mongodb");
//const sequelize = require('../util/database');
const db = require("../util/database").getDB;
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; //{items : []}
    this._id = id;
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
addToCart(product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: new ObjectId(product._id),
      quantity: newQuantity,
    });
  }
  const updatedCart = { items: updatedCartItems };
  const db = getDB();
  return db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    );
}

getCart() {
  const db = getDB();
  const productIds = this.cart.items.map((i) => {
    return i.productId;
  });
  return db
    .collection("products")
    .find({ _id: { $in: productIds } })
    .toArray()
    .then((products) => {
      return products.map((p) => {
        return {
          ...p,
          quantity: this.cart.items.find((i) => {
            return i.productId.toString() === p._id.toString();
          }).quantity,
        };
      });
    });
}

deleteItemFromCart(productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  const db = getDB();
  return db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: { items: updatedCartItems } } }
    );
}
}

module.exports = User;