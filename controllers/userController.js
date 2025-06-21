const User = require("../models/User");

// Save a new user
async function store(req, res) {
  console.info("📝 Creando un nuevo usuario:", req.body.username);
  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    profileImage: "../img/unknown.jpg",
  });
  try {
    const newUserMail = await User.findOne({ email: newUser.email });
    const newUserUsername = await User.findOne({ username: newUser.username });

    if (newUserMail) {
      console.error("❌ Error: El correo electrónico ya está en uso:", newUser.email);
      res.json("This email is already in use.");
    } else if (newUserUsername) {
      console.error("❌ Error: El nombre de usuario ya está en uso:", newUser.username);
      res.json("This username is already in use.");
    } else {
      const savedUser = await newUser.save();
      console.info("✅ Usuario creado exitosamente:", savedUser.username);
      res.json(savedUser);
    }
  } catch (err) {
    console.error("❌ Error al crear el usuario:", err);
    res.status(500).json("Error al crear el usuario");
  }
}

// Display the specified resource.
async function getUser(req, res) {
  console.info("🔍 Buscando usuario:", req.params.username);
  const user = await User.findOne({ username: req.params.username }).populate("tweets");
  
  if (!user) {
    console.error("❌ Usuario no encontrado:", req.params.username);
    return res.status(404).json("User not found");
  } else {
    console.info("🔍 Usuario encontrado:", user);
    res.json(user);
  }
}

async function getUsers(req, res) {
  console.info("🔍 Buscando todos los usuarios");
  const users = await User.find();
  if (users) {
    console.info("🔍 Usuarios encontrados:", users.length);
    return res.json(users);
  } else {
    console.error("❌ No se encontraron usuarios");
    return res.status(404).json("Users not found");
  }
}

async function showFollowing(req, res) {
  const myUser = await User.findById(req.params.id);
  console.info(`🔍 [${myUser.username}] Buscando usuarios seguidos`);
  const allUsers = await User.find();
  const followed = [];
  allUsers.filter((d) => {
    if (myUser.following.includes(d.id)) {
      return followed.push(d);
    }
  });
  if (followed.length === 0) {
    console.info(`🔍 [${myUser.username}] No sigues a ningún usuario.`);
    return res.json("No sigues a ningún usuario.");
  }
  console.info(`🔍 [${myUser.username}] Usuarios seguidos encontrados:`, followed.length);
  return res.json(followed);
}

async function follow(req, res) {
  const myUser = await User.findById(req.user.id);
  console.info(`🔍 [${myUser.username}] Intentando seguir al usuario con ID: ${req.params.id}`);

  const userToFollow = await User.findById(req.params.id);

  if (myUser.following.includes(req.params.id)) {
    console.info(`🔍 [${myUser.username}] Ya sigues al usuario: ${userToFollow.username}`);
    return res.json("ya lo sigues");
  } else if (userToFollow.followers.includes(req.user.id)) {
    console.info(`🔍 [${myUser.username}] Incongruencia detectada: ya sigues a este usuario, pero él no te sigue a ti.`);
    return res.json("ya lo sigues, hay una incongruencia!");
  } else {
    await User.findByIdAndUpdate(req.user.id, { $push: { following: req.params.id } });
    await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user.id } });
    console.info(`🔍 [${myUser.username}] Ahora sigues al usuario: ${userToFollow.username}`);
    return res.json(userToFollow);
  }
}

async function unfollow(req, res) {
  const myUser = await User.findById(req.user.id);
  console.info(`🔍 [${myUser.username}] Intentando dejar de seguir al usuario con ID: ${req.params.id}`);

  const userToFollow = await User.findById(req.params.id);

  if (myUser.following.includes(req.params.id)) {
    await User.findByIdAndUpdate(req.user.id, { $pull: { following: req.params.id } });
    await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user.id } });

    console.info(`🔍 [${myUser.username}] Has dejado de seguir al usuario: ${userToFollow.username}`);
    return res.json(userToFollow);
  } else {
    console.info(`🔍 [${myUser.username}] No sigues al usuario con ID: ${req.params.id}`);
    return res.json("No lo sigues");
  }
}

async function showFollowers(req, res) {
  const myUser = await User.findById(req.params.id);
  console.info(`🔍 [${myUser.username}] Buscando seguidores`);
  const allUsers = await User.find();
  const followers = [];
  allUsers.filter((d) => {
    if (myUser.followers.includes(d.id)) {
      return followers.push(d);
    }
  });
  console.info(`🔍 [${myUser.username}] Seguidores encontrados:`, followers.length);
  return res.json(followers);
}
module.exports = {
  getUser,
  store,
  showFollowing,
  follow,
  unfollow,
  showFollowers,
  getUsers,
};
