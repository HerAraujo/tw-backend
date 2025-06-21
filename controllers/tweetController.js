const Tweet = require("../models/Tweet");
const User = require("../models/User");
const { use } = require("../routes/apiRoutes");

async function store(req, res) {
  console.info("📝 Creando un nuevo tweet por el usuario:", req.user.id);
  const tweet = String(req.body.content);
  const newTweet = await new Tweet({
    author: req.user.id,
    content: tweet,
    likes: [],
  }).populate("author");
  await newTweet.save();
  await User.findByIdAndUpdate(req.user.id, { $push: { tweets: newTweet.id } });
  console.info("✅ Tweet creado exitosamente:", newTweet._id);
  res.status(200).json({ newTweet });
}

async function destroy(req, res) {
  console.info("🗑️ Intentando borrar el tweet con ID:", req.params.id);
  const user = await User.findById(req.user.id);
  if (!user) {
    console.error("❌ Usuario no encontrado:", req.user.id);
    return res.status(404).json("Usuario no encontrado");
  }
  await user.populate("tweets");
  if (!user.tweets) {
    console.error("❌ El usuario no tiene tweets asociados:", user.username);
    return res.status(404).json("No tienes tweets asociados");
  }
  const userTweets = user.tweets.map(tweet => tweet.id);
  console.info("🗑️ Tweets del usuario:", userTweets);
  if (userTweets.includes(req.params.id)) {
    await Tweet.findByIdAndDelete(req.params.id);
    console.info("✅ Tweet borrado exitosamente:", req.params.id);
    res.status(200).json("Tweet borrado con éxito");
  } else {
    console.error("❌ El tweet no pertenece al usuario:", user.username);
    res.status(401).json("Este tweet no es tuyo");
  }
}

async function like(req, res) {
  console.info("👍 Intentando dar like al tweet con ID:", req.params.id);
  const user = req.user.id;
  const id = req.params.id;
  const tweet = await Tweet.findById(id);
  if (!tweet.likes.includes(user)) {
    await Tweet.findByIdAndUpdate(id, { $push: { likes: user } });
    console.info(`👍 Like exitoso al tweet ${tweet.id}.`);
    res.status(200).json("Like exitoso.");
  } else {
    console.error(`❌ No puede dar like al tweet ${tweet.id} porque ya lo hizo.`);
    res.status(401).json("No puede dar like porque lo hiciste antes.");
  }
}

async function dislike(req, res) {
  const user = req.user.id;
  console.info(`👎 Intentando dar dislike al tweet con ID: ${req.params.id}`);
  const id = req.params.id;
  const tweet = await Tweet.findById(id);
  if (tweet.likes.includes(user)) {
    await Tweet.findByIdAndUpdate(id, { $pull: { likes: user } });
    console.info(`👎 Dislike exitoso al tweet ${tweet.id}.`);
    res.status(200).json("Dislike exitoso.");
  } else {
    console.error(`❌ No puede dar dislike al tweet ${tweet.id} porque nunca dio like.`);
    res.status(401).json("Nunca dio like");
  }
}

async function show(req, res) {
  console.info(`🔍 Buscando tweets del usuario: ${req.params.username}`);
  const user = await User.findOne({ username: req.params.username });
  const tweets = await Tweet.find({ author: user.id }).sort({ createdAt: -1 }).populate("author");
  if (tweets.length === 0) {
    console.info(`🔍 No se encontraron tweets para el usuario: ${user.username}`);
    return res.status(200).json({ tweets: [] });
  }
  console.info(`🔍 Tweets encontrados para el usuario ${user.username}:`, tweets.length);
  res.status(200).json({ tweets });
}

async function getTweetsOfFollowing(req, res) {
  const user = await User.findById(req.params.id);
  console.info(`🔍 Buscando tweets de los usuarios seguidos por: ${user.username}`);
  const tweets = await Tweet.find({ author: { $in: [...user.following, user.id] } })
    .sort({ createdAt: -1 })
    .populate("author");

    console.info(`🔍 [${user.username}] Tweets encontrados: ${tweets.length}`);
    res.json({ tweets });
}
module.exports = {
  store,
  destroy,
  show,
  like,
  dislike,
  getTweetsOfFollowing,
};
