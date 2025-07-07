const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

const formDatatoSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    access_token,
    _id: user._id,
    profile_picture: user.profile_picture,
    fullname: user.fullname,
    username: user.username,
  };
};

const generateUsername = async (email) => {
  const { nanoid } = await import("nanoid");
  let username = email.split("@")[0];

  const isUsernameNotUnique = await User.exists({ username }).then(
    (result) => result
  );

  if (isUsernameNotUnique) {
    username += nanoid().substring(0, 5);
  }

  return username;
};

router.post("/register", async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;

  if (fullname.length < 3) {
    return res.status(403).json({ error: "Username must be 3 letters long" });
  }

  if (!email.length) {
    return res.status(403).json({ error: "Email is required." });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email Invalid" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Invalid password format. Must contain uppercase, lowercase, and number (6–20 characters).",
    });
  }

  if (password !== confirmPassword) {
    return res.status(403).json({ error: "Password do not match." });
  }
  bcrypt.hash(password, 10, async (err, hashed_passwod) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to encrypt password. Please try again later." });
    }

    const username = await generateUsername(email);

    if (username.length < 3) {
      return res.status(400).json({ error: "Username must be 3 letters long" });
    }

    const user = new User({
      fullname,
      email,
      password: hashed_passwod,
      username,
    });

    user
      .save()
      .then((u) => {
        return res.status(200).json(formDatatoSend(u));
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res.status(500).json({ error: "Email is already" });
        }
        return res.status(500).json({ error: err.message });
      });
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({
          error: "User not found",
        });
      }

      const isMatch = bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(403).json({
          error: "Incorrect password.",
        });
      } else {
        return res.status(200).json(formDatatoSend(user));
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});
module.exports = router;
