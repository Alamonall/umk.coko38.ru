const pmo = require('./pmo/getPmo');
const listEmcOnSchool = require('./pmo/listEmcOnSchool');
const listEmc = require('./pmo/listEmc');
const createEmc = require('./pmo/createEmc');
const updateEmc = require('./pmo/updateEmc');
const deleteEmc = require('./pmo/deleteEmc.js');
const updateEmcOnSchool = require('./pmo/updateEmcOnSchool');
const attachEmc = require('./pmo/attachEmc');
const detachEmc = require('./pmo/detachEmc');
const listEmcToAttach = require('./pmo/listEmcToAttach');

module.exports = {
  pmo,
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
