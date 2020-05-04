const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util"); // node utility function
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget); // convert callback to promise by promisify to avoid callback
const exec = mongoose.Query.prototype.exec;

// create own cache function of mongoose
mongoose.Query.prototype.cache = async function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "");
  return this; // return this for chaining cache() function
};

// monkey pacth on mongoose exec function
mongoose.Query.prototype.exec = async function () {
  // if it is not from chache() func then it will return simple exec()
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  const key = JSON.stringify(
    //  object.assign will assign parameters give to frist empty object
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  const cacheValue = await client.hget(this.hashKey, key);

  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    // chech the data is array or not
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d)) // format each data of array to mongoose data format
      : new this.model(doc); // format data to mongoose data format
  }
  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey, key, JSON.stringify(result), "EX", 10);

  return result;
};

// this is for clear hash keys
module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
