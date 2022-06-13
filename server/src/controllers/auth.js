const { User, UserRole } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

function jwtSignUser(user) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK,
  });
}

// eslint-disable-next-line no-undef
module.exports = app = {
  async signup(req, res) {
    try {
      const user = await User.create(req.body);

      const userJson = user.toJSON();
      res.json({
        user: userJson,
        token: jwtSignUser(userJson),
      });
    } catch (err) {
      res.status(400).json({
        error: `Ошибка при создании пользователя: ${req.body}`,
        dev_error: err.message,
      });
    }
  },
  async signin(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({
        include: [
          {
            model: UserRole,
          },
        ],
        where: {
          username: username,
        },
      });

      if (!user) {
        return res.status(403).json({
          message: 'Введены не корректные данные 1',
        });
      }

      const isPasswordValid = user.comparePassword(password);
      if (!isPasswordValid)
        return res.status(403).json({
          message: 'Введены не корректные данные 2',
        });

      const userJson = user.toJSON();
      res.json({
        user: userJson,
        token: jwtSignUser(userJson),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'Ошибка на стороне сервера',
      });
    }
  },
};
