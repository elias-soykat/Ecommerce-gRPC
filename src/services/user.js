const bcrypt = require("bcrypt");
const { User } = require("../models");
const { sign } = require("../utils/jwt");

module.exports = {
  Register: async (call, callback) => {
    try {
      const { email, password } = call.request;
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return callback(null, { message: "User already exists" });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      await User.create({ email, passwordHash, role: "user" });
      callback(null, { message: "Registration successful" });
    } catch (err) {
      callback({ code: 13, message: err.message });
    }
  },

  Login: async (call, callback) => {
    try {
      const { email, password } = call.request;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return callback({ code: 16, message: "Invalid credentials" });
      }
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return callback({ code: 16, message: "Invalid credentials" });
      }
      const token = sign({
        userId: user.id,
        email: user.email,
        role: user.role,
      });
      callback(null, { token });
    } catch (err) {
      callback({ code: 13, message: err.message });
    }
  },
};
