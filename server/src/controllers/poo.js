const poo = require('./poo/getPoo');
const listEmcOnSchool = require('./poo/listEmcOnSchool');
const listEmc = require('./poo/listEmc');
const createEmc = require('./poo/createEmc');
const updateEmc = require('./poo/updateEmc');
const deleteEmc = require('./poo/deleteEmc.js');
const updateEmcOnSchool = require('./poo/updateEmcOnSchool');
const attachEmc = require('./poo/attachEmc');
const detachEmc = require('./poo/detachEmc');
const listEmcToAttach = require('./poo/listEmcToAttach');

module.exports = {
  poo,
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
