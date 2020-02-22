let express = require("express");
let router = express.Router();
let nodemailer = require("nodemailer");
let crypto = require("crypto");
let User = require("../dbModel/user");

router.post("/nodemailer", async(req,res) => {
    let user = await User.userModel.findOne({"UserLogin.EmailId": req.body.UserLogin.EmailId});
    if(!user){return res.status(403).send({message: "Invalid email id"})};
    let token = crypto.randomBytes(32).toString("hex");
    user.resetpasswordtoken = token;
    user.resetpasswordexpires = Date.now() + 3600000 // 1 hrs
    await user.save();

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user: 'bhoirchhotya1@gmail.com',
            pass: 'fulaji@251292'
        }
    });
    if(!transporter) res.status(401).send({
        message: 'something went wrong!'
    });
    //setup email data with unicodes symbols
    let mailOptions = {
        from: '"FB Apps:sweat_smile:" <bhoirchhotya1@gmail.com>',
        to: user.UserLogin.EmailId,
        subject: 'Reset Your Password',
        text: 'open this link to change your password http://localhost:4600/forgotpassword/' + token
    };
    transporter.sendMail(mailOptions,(error, info) =>{
        if(error){
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
    res.send({message: "Please check your mailbox", d:user});
});

module.exports = router;