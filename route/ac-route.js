const accontroller = require('../controller/ac-controllers');


exports.routesConfig = function (app) {
  app.post('/api/v1/user/create', [
    //authorization.verifyToken,
    accontroller.insert
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
  
  app.post('/get/list',[
    accontroller.getList
  ])
  app.post('/get/toplevel',[
    accontroller.gettoplevel
  ])
};