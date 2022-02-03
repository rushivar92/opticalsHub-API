const { json } = require('express/lib/response');
const accontroller = require('../controller/user-controllers');


exports.routesConfig = function (app) {
  app.get('/api/v1/list/users', [
    //authorization.verifyToken,
    accontroller.list_users
  ]);
  app.post('/api/v1/user/create', [
    //authorization.verifyToken,
    accontroller.sign_up
  ]);
  app.put('/api/v1/user/update', [
    //authorization.verifyToken,
    accontroller.update_user
  ]);
  app.post('/api/v1/signin', [
    accontroller.login
  ]);
   app.post('/api/v1/otp/verify', [
    //authorization.verifyToken,

    accontroller.otpverify
  ]);
  app.post('/api/v1/user/get', [
    accontroller.getUser
  ])
  app.post('/api/v1/changepassword', [
    //authorization.verifyToken,
    accontroller.ChangePassword
  ]);
  app.post('/api/v1/forgot/password', [
    //authorization.verifyToken,
    accontroller.forgotPassword
  ]);
  
  app.post('/api/v1/user/deactivate',[
    accontroller.userDeactive
  ])
  app.post('/api/v1/user/logout',[
    accontroller.logout
  ])
};