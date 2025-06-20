const express = require("express");
const tokenController = require("../controllers/tokenController");
const apiRouter = express.Router();
const tweetController = require("../controllers/tweetController");
const userController = require("../controllers/userController");
const checkJwt = require("express-jwt");

require("dotenv").config();

//Genera un nuevo token--createToken
apiRouter.post("/token", tokenController.login);

//Llamar a todos los usuarios.
apiRouter.get("/users", userController.getUsers);

//Crea un nuevo usuario--store
apiRouter.post("/users", userController.store);

//Trae los tweets de un usuario especifico--show HACER POPULATE PARE QUE TE TRAIGA EL USUARIO
apiRouter.get("/tweets/:username", tweetController.show);

//Trae toda la informacion de un usuario.--show
apiRouter.get("/users/:username", userController.getUser);

apiRouter.use(
  checkJwt({
    secret: process.env.ACCESS_TOKEN,
    algorithms: ["HS256"],
  }),
);

// mOSTRAR LOS TWEETS DE LOS SEGUIDOS DE UN USUARIO
apiRouter.get("/tweets/following/:id", tweetController.getTweetsOfFollowing);

//Crea un tweet--create
apiRouter.post("/tweets", tweetController.store);

// Borra un tweet en específico--destroy
apiRouter.delete("/tweets/:id", tweetController.destroy);

// Da like a un tweet en específico--like
apiRouter.post("/tweets/like/:id", tweetController.like);

// Da dislike a un tweet en específico--dislike
apiRouter.delete("/tweets/like/:id", tweetController.dislike);

//Trae los usuarios que sigue un usuario--showFollowing
apiRouter.get("/users/:id/following", userController.showFollowing);

//Agrega un usuario a la lista de seguidos. El id corresponde al usuario que quiero seguir --follow
apiRouter.post("/users/follow/:id", userController.follow);

//Elimina un usuario de la lista de seguidos. El id corresponde al usuario que quiero dejar de seguir --unfollow
apiRouter.delete("/users/follow/:id", userController.unfollow);

//Trae los usuarios que sigue un usuario--showFollowers
apiRouter.get("/users/:id/followers", userController.showFollowers);

module.exports = apiRouter;
