require('dotenv/config');
const { UserRole } = require('../models');

module.exports = {
  async isAdmin(req, res, next) {
    const userRole = await UserRole.findOne({
      attributes: ['code'],
      where: { id: req.user.role_id },
    });
    if (userRole.code == 1) next();
  },
  async isPmo(req, res, next) {
    const userRole = await UserRole.findOne({
      attributes: ['code'],
      where: { id: req.user.role_id },
    });
    if (userRole.code == 2) next();
  },
  async isPoo(req, res, next) {
    const userRole = await UserRole.findOne({
      attributes: ['code'],
      where: { id: req.user.role_id },
    });
    if (userRole.code == 3) next();
  },
};
