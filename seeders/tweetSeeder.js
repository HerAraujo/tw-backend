const Tweet = require("../models/Tweet");
const User = require("../models/User");
const { faker } = require("@faker-js/faker");

faker.locale = "es";

module.exports = async () => {
  const tweets = [];

  Tweet.collection.drop();

  for (let i = 1; i < 100; i++) {
    const random = Math.floor(Math.random() * (19 - 1) + 1);
    const user = await User.findOne().skip(random);
    const tweet = new Tweet({ content: faker.lorem.sentence(20), author: user });
    user.tweets.push(tweet);
    user.save();
    tweets.push(tweet);
  }

  await Tweet.create(tweets);
  console.log("Tweet seeder check!");
};
