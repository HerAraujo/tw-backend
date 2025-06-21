const { faker } = require("@faker-js/faker");
const { find } = require("../models/User");
const User = require("../models/User");
const _ = require("lodash");

faker.locale = "es";

function fixGateway(url) {
  if (!url.includes("cloudflare-ipfs.com")) return url;
  return url.replace("cloudflare-ipfs.com", "gateway.pinata.cloud");
}

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
      profileImage: fixGateway(faker.image.avatar()),
      following: [],
    });
    users.push(user);
  }
  const tryDemoUser = new User({
    firstname: "Demo",
    lastname: "User",
    username: "user",
    password: "user",
    email: "user@gmail.com",
    description: "Este es un usuario de demostración.",
    profileImage: fixGateway(faker.image.avatar()),
    following: [users[0].id, users[1].id, users[2].id]
  });
  users.push(tryDemoUser);

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

  console.log("[Database] Se corrió el seeder de Users.");
};
