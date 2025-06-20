const { faker } = require("@faker-js/faker");
const { find } = require("../models/User");
const User = require("../models/User");
const _ = require("lodash");

faker.locale = "es";

module.exports = async () => {
  const users = [];
  User.collection.drop();

  for (let i = 0; i < 20; i++) {
    const user = new User({
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      username: faker.internet.userName(),
      password: "user",
      email: faker.internet.email(),
      description: faker.lorem.paragraph(),
      profileImage: faker.image.avatar(),
      following: [],
    });
    users.push(user);
  }

  await User.create(users);

  const usersToUpdate = await User.find();

  for (const user of usersToUpdate) {
    const randomUsers = _.sampleSize(usersToUpdate, 10).filter(
      (randomUser) => randomUser.id !== user.id,
    );

    const randomNumber = Math.floor(Math.random() * 10);

    await User.updateOne(user, {
      username: `${user.firstname}.${user.lastname}.${randomNumber}`,
      email: `${user.firstname}@${user.lastname}.${randomNumber}`,
      followers: randomUsers,
    });

    for (const follower of randomUsers) {
      follower.following = [...follower.following, user.id];
      await follower.save();
    }
  }
  await User.updateOne({ id: usersToUpdate[0].id }, { username: "user" });

  console.log("[Database] Se corrió el seeder de Users.");
};
