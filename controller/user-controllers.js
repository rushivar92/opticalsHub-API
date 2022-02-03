const { User } = require('../dto/users')
const { Geners } = require('../dto/geners')
const { createToken } = require('../common/authorization/Jwtauthorization')
const config = require('../common/authorization/messages')
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const { emailSignupTemplate, emailForgotpwdTemplate, emailChangepwdTemplate } = require('../common/templates/email');
const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'stoneframes.com@gmail.com',
    pass: 'Mittumyson'
  }
}));

exports.login = async (req, res) => {

  let user = await User.findOne({ "email": req.body.email });
  if (user === null) {
    res.status(401).send({ "user_msg": "invalid email", "status_code": 0 })
  }
  if (user.password != req.body.password) {
    res.status(401).send({ "user_msg": "invalid password", "status_code": 0 })
  }
  if (user.is_active === false) {
    res.status(401).send({ "msg": "user deactive", "status_code": 0 })
  }
  else {
    const create_token = createToken(user);
    // await User.updateOne({"email":req.body.email},{$set: { "token" :create_token}})
    res.status(200).send({ "user_msg": config.LOGIN, "status_code": 1, "userdata": user, "token": create_token })
  }
};



exports.login_with_otp = async (req, res) => {
  let user_otp = stringGen(4)
  let user = await User.findByIdAndUpdate({ "email": req.body.email }, { "$set": { "otp": user_otp } });
  console.log("the given user info is", user)
  if (user === null) {
    res.status(401).send({ "user_msg": "invalid email", "status_code": 0 })
  }
  try {
    var mailOptions = {
      from: "rushivar92@gmail.com",
      to: req.body.email,
      subject: "OTP",
      text: "OTP : " + user_otp,
    };
    console.log("mailOptions", mailOptions)
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.json({
          message: "error",
          status_code: 200,
        });
      } else {
        //  console.log("Email sent: " + info.response);
        return res.send({
          "user_msg": "User created successfully... ", "user_data": user
        });
      }
    });

  }
  catch (err) {
    return res.status(500).send({
      "user_msg": "Error create user",
    });
  }
};

exports.list_users = async (req, res) => {
  User.find(function (error, info) {
    if (error) {
      res.json({
        message: "error",
        status_code: 200,
      });
    } else {
      res.json({
        message: "success",
        items: info,
        status_code: 200,
      });
    }
  });
}

exports.sign_up = async (req, res) => {
  let user_otp = stringGen(4)
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  try {
    await user.save();
    const mailOptions = {
      from: 'stoneframes.com@gmail.com',
      to: req.body.email,
      subject: 'Welcome Email',
      html: emailSignupTemplate(req.body.name)
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.json({
          message: "error",
          status_code: 200,
        });
      } else {
        //  console.log("Email sent: " + info.response);
        return res.send({
          "user_msg": "User created successfully... ", "user_data": user, "status_code": 200
        });
      }
    });
  }
  catch (err) {
    return res.status(500).send({
      "user_msg": "Error create user",
    });
  }
};


exports.update_user = async (req, res) => {
  const id = req.query._id;
  User.findByIdAndUpdate({ _id: id }, { $set: req.body }, function (error, response) {
    if (error) {
      console.log('Error occurred while inserting');
      // return 
    } else {
      console.log('inserted record', response);
      // return 
      res.json({
        message: "success",
        result: response,
        status_code: 200,
      });
    }
  });
}
exports.otpverify = async (req, res) => {
  console.log("login", req.body)
  try {
    let userdata = await User.findOne({ otp: req.body.otp });
    if (userdata === null) {
      return res.status(403).send({ "user_msg": "inavlid otp", "status_code": 0 })
    }
    else {
      return res.status(200).send({ "user_msg": "Success", "status_code": 1 })

    }
  }
  catch (err) {
    console.log("token error", err)
    res.status(500).send({ "user_msg": "inavlid otp", "status_code": 1, "err": err });
  }

};

exports.getUser = async (req, res) => {
  console.log("req.body", req.body)
  if (req.body.user_id === undefined || req.body.user_id === null) {
    res.status(200).send({ "User_msg": "User id is required", "Status_code": 0 })
  }
  try {
    const data = await User.findById({ _id: req.body.user_id });
    if (!data) {
      return res.status(404).send({ "User_msg": "Not Found", "Status_code": 0 });
    }
    res.status(200).send({ "User_msg": " User data", "Status_code": 1, "userdata": data });
  } catch (error) {
    res.status(500).send({ "User_msg": "User data Error", "Status_code": 0 });
  }
}

exports.ChangePassword = async (req, res) => {
  let userdata = await User.findOne({ _id: req.body._id });
  if (userdata === null) {
    res.status(401).send({ "user_msg": "faild authorization", "status_code": 0 })
  }
  if (userdata.password != req.body.oldPassword) {
    res.status(401).send({ "user_msg": config.CHANGE_PASSWORD_ERROR, "status_code": 0 })
  }
  else {
    await User.findByIdAndUpdate({ _id: req.body._id }, { $set: { password: req.body.newpassword } }).then(function (ok) {
      const current_date = new Date();
      const mailOptions = {
        from: 'stoneframes.com@gmail.com',
        to: userdata.email,
        subject: 'Change Password',
        html: emailChangepwdTemplate(userdata.name, current_date)
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.json({
            message: "error",
            status_code: 200,
          });
        } else {
          return res.send({
            "user_msg": "password changed successfully... ", "status_code": 200
          });
        }
      });
    });
  }
};
exports.forgotPassword = async (req, res) => {
  let userdata = await User.findOne({ email: req.body.email });
  console.log("userdata", userdata)
  if (userdata === null) {
    res.status(401).send({ "user_msg": "faild authorization", "status_code": 0 })
  }
  else {
    const mailOptions = {
      from: 'stoneframes.com@gmail.com',
      to: req.body.email,
      subject: 'Forgot Password',
      html: emailForgotpwdTemplate(userdata.name, userdata.password)
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.json({
          message: "error",
          status_code: 200,
        });
      } else {
        return res.send({
          "user_msg": "Forget password sent successfully... ", "status_code": 200
        });
      }
    });
  }
}

exports.userDeactive = (req, res) => {
  User.findByIdAndUpdate({ _id: req.body._id }, { $set: { is_active: req.body.is_active, token: '' } }, function (error, data) {
    res.send({ "user_msg": "user deactivated", "status_code": 1 });
  });
}

exports.logout = (req, res) => {
  User.findByIdAndUpdate({ _id: req.body._id }, { $set: { token: '' } }, function (error, data) {
    return res.send({ "user_msg": "successfully logged out", "status_code": 1 });
  });
}


exports.getList = async (req, res) => {
  const toplevel = [];
  await Geners.find().then(function (listStore) {
    listStore.forEach(function (item) {
      if (item.parent_id === undefined) {
        toplevel.push(item);
      }
    });
    for (let i = 0; i < listStore.length; i++) {
      for (let j = 0; j < toplevel.length; j++) {
        if (toplevel[j]._id.toString() === listStore[i].parent_id) {
          if (toplevel[j]._doc.subcategory != undefined) {
            toplevel[j]._doc.subcategory.push(listStore[i]);
          } else {
            toplevel[j]._doc = Object.assign(toplevel[j]._doc, { subcategory: [] });
            toplevel[j]._doc.subcategory.push(listStore[i]);
          }
        }
      }
    }
    console.log("toplevel", toplevel)
    for (let i = 0; i < toplevel.length; i++) {
      for (let x = 0; x < toplevel[i].subcategory.length; x++) {
        for (let j = 0; j < listStore.length; j++) {
          if (toplevel[i].subcategory[x]._id === listStore[j].parent_id) {
            if (toplevel[i].subcategory[x].subcategory != undefined) {
              toplevel[i].subcategory[x].subcategory.push(listStore[j]);
            } else {
              toplevel[i].subcategory[x] = Object.assign(
                toplevel[i].subcategory[x],
                { subcategory: [] }
              );
              toplevel[i].subcategory[x].subcategory.push(listStore[j]);
            }
          }
        }
      }
    }
    return res.status(200).send({ "user_msg": "Successfully deleted", "status_code": 1, "data": toplevel })
  })
  for (let i = 0; i < toplevel.length; i++) {
    for (let x = 0; x < toplevel[i].subcategory.length; x++) {
      for (let j = 0; j < data.Items.length; j++) {
        if (toplevel[i].subcategory[x].id === data.Items[j].parent_id) {
          if (toplevel[i].subcategory[x].subcategory != undefined) {
            toplevel[i].subcategory[x].subcategory.push(data.Items[j]);
          } else {
            toplevel[i].subcategory[x] = Object.assign(
              toplevel[i].subcategory[x],
              { subcategory: [] }
            );
            toplevel[i].subcategory[x].subcategory.push(data.Items[j]);
          }
        }
      }
    }
  }
  res.json({
    message: "success",
    topLevel: toplevel,
    status_code: 200,
  });

};
exports.gettoplevel = async (req, res) => {
  const toplevel = [];
  const lowlevel = [];
  var params = {
    TableName: "Genre-34xd3ccxmfcyzk7f5zentktr6i-dev",
  };
  docClient.scan(params, function (err, data) {
    if (err) {
      console.log(err);
      res.json({
        message: "Error get data",
        status_code: 200,
      });
    } else {
      data.Items.forEach(function (item) {
        if (item.parent_id === undefined) {
          toplevel.push(item);
        }
      });
      for (let i = 0; i < data.Items.length; i++) {
        for (let j = 0; j < toplevel.length; j++) {
          if (toplevel[j].id === data.Items[i].parent_id) {
            if (toplevel[j].subcategory != undefined) {
              toplevel[j].subcategory.push(data.Items[i]);
            } else {
              toplevel[j] = Object.assign(toplevel[j], { subcategory: [] });
              toplevel[j].subcategory.push(data.Items[i]);
            }
          }
        }
      }
      for (let i = 0; i < toplevel.length; i++) {
        for (let x = 0; x < toplevel[i].subcategory.length; x++) {
          for (let j = 0; j < data.Items.length; j++) {
            if (toplevel[i].subcategory[x].id === data.Items[j].parent_id) {
              if (toplevel[i].subcategory[x].subcategory != undefined) {
                toplevel[i].subcategory[x].subcategory.push(data.Items[j]);
              } else {
                toplevel[i].subcategory[x] = Object.assign(
                  toplevel[i].subcategory[x],
                  { subcategory: [] }
                );
                toplevel[i].subcategory[x].subcategory.push(data.Items[j]);
              }
            }
          }
        }
      }
      res.json({
        message: "success",
        topLevel: toplevel,
        status_code: 200,
      });
    }
  })
}
function stringGen(len) {
  var text = "";

  var charset = "0123456789";

  for (var i = 0; i < len; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
}
function jwtdecoded(token) {
  var token = token
  var decoded = jwt_decode(token);

  return decoded;
}