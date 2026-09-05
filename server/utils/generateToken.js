const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "cambium_secret_key_jwt_token_2026", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
