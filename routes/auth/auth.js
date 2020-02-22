let express = require("express");
let router = express.Router();
let User = require("../../dbModel/user");
let Joi = require("@hapi/joi");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let config = require("config");
let auth = require("../middleware/user.auth");

router.get("/me",auth, async(req,res) => {
    let data = await User.userModel.findById(req.user._id).select("-UserLogin.Password -isAdmin");
    res.send(data);
});

router.post("/auth", async(req,res) => {
    let {error} = authValidation(req.body);
    if(error){return res.send(error.details[0].message)};
    let user = await User.userModel.findOne({"UserLogin.EmailId": req.body.UserLogin.EmailId});
    if(!user){return res.status(403).send({message: "Invalid Email id"})};
    // let password = await User.findOne({"UserLogin.Password": req.body.UserLogin.Password});
    // if(!password){return res.status(403).send({message: "Invalid password"})};
    let password = await bcrypt.compare(req.body.UserLogin.Password, user.UserLogin.Password);
    if(!password){return res.status(403).send({message: "Invalid password"})};
    // let token = jwt.sign({_id: user._id}, config.get("apitoken"));
    let token = user.UserToken();
    res.header("x-auth-token", token).send({message: "Login Successful", token: token});
});

function authValidation(error){
    let schema = Joi.object({
        UserLogin:{
            EmailId: Joi.string().required(),
            Password: Joi.string().required()
        }
    });
    return schema.validate(error);
}

module.exports = router;