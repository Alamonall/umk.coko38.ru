const poo = require('./poo/getPoo');
const listEmcOnSchool = require('./poo/listEmcOnSchool');
const listEmcs = require('./poo/listEmcs');
const createEmc = require('./poo/createEmc');
const updateEmc = require('./poo/updateEmc');
const deleteEmc = require('./poo/deleteEmc.js');
const updateEmcOnSchool = require('./poo/updateEmcOnSchool');
const attachEmc = require('./poo/attachEmc');
const detachEmc = require('./poo/detachEmc');
const listEmcsForAttach = require('./poo/listEmcsForAttach');

module.exports = {
  poo,
  listEmcOnSchool,
  listEmcs,
  listEmcsForAttach,
  createEmc,
  updateEmc,
  deleteEmc,
  updateEmcOnSchool,
  attachEmc,
  detachEmc,
};
