import bcrypt from "bcrypt";
import Router from "express";
import jwt from "jsonwebtoken";

import User from "../models/userModel";
import URLError from "../utils/customErrors";
import getToken from "../utils/tokenHandler";

const userAPIRoutes = Router();

userAPIRoutes.post("/create", async (request, response, next) => {
  const { userid, name, password, email, type } = request.body;
  try {
    const checkUser =
      (await User.findOne({ userid })) || (await User.findOne({ email }));
    if (checkUser) {
      throw new URLError("ID_EXIST", 409, "Username/Email already exists!");
    } else {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const user = new User({
        userid,
        name,
        password: passwordHash,
        email,
        type,
      });
      const newUser = await user.save();
      response.status(201).json(newUser);
    }
  } catch (error) {
    next(error);
  }
});

userAPIRoutes.post("/login", async (request, response, next) => {
  const { userid, email, password } = request.body;
  try {
    const user = userid
      ? await User.findOne({ userid })
      : await User.findOne({ email });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password);
    if (!(user && passwordCorrect)) {
      throw new URLError(
        "FALSE_AUTH",
        401,
        "Wrong Username/Email or Password."
      );
    }
    const tokenData = {
      userid,
      // eslint-disable-next-line no-underscore-dangle
      id: user._id,
      type: user.type,
    };
    const token = jwt.sign(tokenData, process.env.SECRET);
    response.status(200).send({
      token,
      userid: user.userid,
      // eslint-disable-next-line no-underscore-dangle
      id: user._id,
    });
  } catch (error) {
    next(error);
  }
});

userAPIRoutes.get("/getall", async (request, response, next) => {
  try {
    const token = getToken(request);
    if (!token) {
      throw new URLError("TOKEN_MISSING", 401, "JWT Token missing.");
    }
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (decodedToken.type !== "admin") {
      throw new URLError("RESTRICTED", 401, "Not an admin.");
    }
    const users = await User.find({}).populate("urls", { url: 1, slug: 1 });
    if (users) {
      response.json(users);
    } else {
      throw new Error("Something bad happened.");
    }
  } catch (error) {
    next(error);
  }
});

export default userAPIRoutes;
