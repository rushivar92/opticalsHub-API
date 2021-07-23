const { User } = require('../model/users')
const { Geners } = require('../model/geners')
const config = require('../common/authorization/messages')
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "prreddy9640@gmail.com",
        pass: "ramanj@ram",
    },
});

exports.insert = async (req, res) => {
    let user_otp=stringGen(4)
    user = new User({
        user_name: req.body.user_name,
        mobile_no: req.body.mobile_no,
        email: req.body.email,
        password: req.body.password,
        otp:user_otp
    });
    try {

        await user.save();
        var mailOptions = {
            from: "prreddy9640@gmail.com",
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

exports.login = async (req, res) => {
        let agentdata = await User.findOne({ "email": req.body.email });

    console.log("after login agent data", agentdata)
    if (agentdata === null) {
        res.status(401).send({ "user_msg": "invalid email", "status_code": 0 })
    }
    if (agentdata.password != req.body.password) {
        res.status(401).send({ "user_msg": "invalid password", "status_code": 0 })
    }
    if (agentdata.is_active === false) {
        res.status(401).send({ "msg": "user deactive", "status_code": 0 })
    }
    if (agentdata.otp_verify === false) {
        res.status(401).send({ "msg": "please verify otp", "status_code": 0 })
    }
else{
    res.status(200).send({ "user_msg": config.LOGIN, "status_code": 1, "userdata": agentdata})

}

};

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
        console.log("data", data)
        if (!data) {
            return res.status(404).send({ "User_msg": "Not Found", "Status_code": 0 });
        }
        res.status(200).send({ "User_msg": " User data", "Status_code": 1, "userdata": data });
    } catch (error) {
        res.status(500).send({ "User_msg": "User data Error", "Status_code": 0 });
    }
}

exports.ChangePassword = async (req, res) => {
    let userdata = await User.findOne({ _id: req.body.use_id });
    console.log("check mobile already exists or not", userdata)
    if (userdata === null) {
        res.status(401).send({ "user_msg": "faild authorization", "status_code": 0 })
    }
    if (userdata.password != req.body.oldPassword) {
        res.status(401).send({ "user_msg": config.CHANGE_PASSWORD_ERROR, "status_code": 0 })
    }
    else {
        await User.findByIdAndUpdate({ _id: req.body.use_id }, { $set: { password: req.body.newpassword } }).then(function (ok) {

            return res.send({ "user_msg": config.CHANGE_PASSWORD, "status_code": 1 });


        });
    }


};
exports.forgotPassword = async (req, res) => {
    // const bearerHeader = req.headers["authorization"];
    // const bearer = bearerHeader.split(" ");
    // const bearerToken = bearer[1];
    // const jtoken = jwtdecoded(bearerToken)
    let userdata = await User.findOne({ email: req.body.email });
    console.log("check email already exists or not", userdata)
    if (userdata === null) {
        res.status(401).send({ "user_msg": "faild authorization", "status_code": 0 })
    }

    else {
        var mailOptions = {
            from: "prreddy9640@gmail.com",
            to: req.body.email,
            subject: "Password",
            text: "Password :  : " + userdata.password,
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
        console.log("toplevel",toplevel)
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
        return res.status(200).send({  "user_msg": "Successfully deleted", "status_code": 1,"data":toplevel })
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
    })}
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