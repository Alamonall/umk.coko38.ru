const authController = require('./controllers/auth');
const authContPolicy = require('./policies/auth');

const pooRouter = require('./routers/poo.router');
const pmoRouter = require('./routers/pmo.router');
const adminRouter = require('./routers/admin.router');

const isAuthenticated = require('./policies/isAuth');
const roleCheck = require('./policies/roleCheck');

module.exports = (app) => {
  app.use('/poo', isAuthenticated, roleCheck.isPoo, pooRouter);
  app.use('/pmo', isAuthenticated, roleCheck.isPmo, pmoRouter);
  app.use('/admin', isAuthenticated, roleCheck.isAdmin, adminRouter);
  app.post('/signup', authContPolicy.signup, authController.signup);
  app.post('/signin', authController.signin);
};
