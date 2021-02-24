import Router from "express";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

import Url from "../models/urlModel";
import urlValidationSchema from "../utils/validator";
import URLError from "../utils/customErrors";
import User from "../models/userModel";

import getToken from "../utils/tokenHandler";

const urlAPIRouter = Router();

urlAPIRouter.get("/", (request, response) => {
  response.status(301).redirect("https://shortener.aloks.dev");
});

urlAPIRouter.get("/:id", async (request, response) => {
  const { id: slug } = request.params;
  const url = await Url.findOne({ slug });
  if (url) {
    response.status(301).redirect(url.url);
  } else {
    response.status(404).redirect(`https://shortener.aloks.dev`);
  }
});

urlAPIRouter.post("/api/shorten", async (request, response, next) => {
  // eslint-disable-next-line prefer-const
  let { url, slug } = request.body;
  try {
    const token = getToken(request);
    if (!token) {
      throw new URLError("TOKEN_MISSING", 401, "JWT Token missing.");
    }
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken) {
      throw new URLError("TOKEN_INVALID", 401, "JWT Token invalid.");
    }

    await urlValidationSchema.validate({
      url,
      slug,
    });

    if (url.includes("aloks.dev")) {
      throw new URLError("TEAPOT", 418, "I'm a teapot. 🫖");
    }

    if (!slug) {
      slug = nanoid(5);
    } else if (slug === "api" || slug === "url") {
      throw new Error("RESERVED", 400, "Sorry, Reserved keyword. 😖");
    } else {
      const existing = await Url.exists({ slug });
      if (existing) {
        throw new URLError("ALREADY_USED", 409, "Slug already in use. ☹");
      }
    }

    slug = slug.toLowerCase();

    const user = await User.findById(decodedToken.id);
    const newUrl = new Url({
      slug,
      url,
      // eslint-disable-next-line no-underscore-dangle
      associatedUser: user._id,
    });
    const createdUrl = await newUrl.save();
    // eslint-disable-next-line no-underscore-dangle
    user.urls = user.urls.concat(createdUrl._id);
    await user.save();

    if (createdUrl) {
      response.json(createdUrl);
    } else {
      throw new Error("Cannot save to DB.");
    }
  } catch (error) {
    next(error);
  }
});

urlAPIRouter.post("/api/anon_shorten", async (request, response, next) => {
  // eslint-disable-next-line prefer-const
  let { url, slug } = request.body;
  try {
    await urlValidationSchema.validate({
      url,
      slug,
    });

    if (url.includes("aloks.dev")) {
      throw new URLError("TEAPOT", 418, "I'm a teapot. 🫖");
    }

    if (!slug) {
      slug = nanoid(5);
    } else if (slug === "api" || slug === "url") {
      throw new Error("RESERVED", 400, "Sorry, Reserved keyword. 😖");
    } else {
      slug = slug.toLowerCase();
      const existing = await Url.exists({ slug });
      if (existing) {
        throw new URLError("ALREADY_USED", 409, "Slug already in use. ☹");
      }
    }

    slug = slug.toLowerCase();
    const associatedUser = "5fe2081d269807118925e599";
    let createdUrl = null;
    const newUrl = new Url({
      slug,
      url,
      associatedUser,
    });
    createdUrl = await newUrl.save();
    if (createdUrl) {
      response.json(createdUrl);
    } else {
      throw new Error("Cannot save to DB.");
    }
  } catch (error) {
    next(error);
  }
});

export default urlAPIRouter;
