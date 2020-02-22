let express = require("express");
let router = express.Router();
let User = require("../dbModel/user");
let bcrypt = require("bcrypt");
let Joi = require("@hapi/joi");

router.post("/forgotpassword/:token", async(req,res) => {
    let user = await User.userModel.findOne({
        "resetpasswordtoken": req.params.token,
        "resetpasswordexpires":{
            $gt: Date.now()
        }
    });
    if(!user){return res.status(403).send({message: "Invalid token or token got expired"})};
    let {error} = Validationerror(req.body);
    if(error){return res.send(error.details[0].message)};
    let oldpassword = await bcrypt.compare(req.body.UserLogin.Password, user.UserLogin.Password);
    if(oldpassword){return res.status(402).send({message: "Hey its your old password! please make something new passsword"})};
    user.UserLogin.Password = req.body.UserLogin.Password;
    user.resetpasswordtoken = undefined;
    user.resetpasswordexpires = undefined;
    let salt = await bcrypt.genSalt(10);
    user.UserLogin.Password = await bcrypt.hash(user.UserLogin.Password, salt);
    await user.save();
    res.send({message: "password updated"});
});

function Validationerror(error){
    let schema = Joi.object({
        UserLogin:{
            Password: Joi.string().required()
        }
    });
    return schema.validate(error);
}

module.exports = router;