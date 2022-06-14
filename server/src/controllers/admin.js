const admin = require('./admin/getadmin');
const listEmcOnSchool = require('./admin/listEmcOnSchool');
const listEmc = require('./admin/listEmc');
const createEmc = require('./admin/createEmc');
const updateEmc = require('./admin/updateEmc');
const deleteEmc = require('./admin/deleteEmc.js');
const updateEmcOnSchool = require('./admin/updateEmcOnSchool');
const attachEmc = require('./admin/attachEmc');
const detachEmc = require('./admin/detachEmc');
const listEmcToAttach = require('./admin/listEmcToAttach');

module.exports = {
  admin,
  listEmcOnSchool,
  listEmc,
  listEmcToAttach,
  createEmc,
  updateEmc,
  deleteEmc,
  updateEmcOnSchool,
  attachEmc,
  detachEmc,
};
