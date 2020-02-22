let Joi = require("@hapi/joi");
let config = require("config");
let jwt = require("jsonwebtoken");
let mongoose = require("mongoose");
let userSchema = new mongoose.Schema({
    FirstName: { type: String, min: 3, max: 200, required: true, alphanum: true, trim: true },
    LastName: { type: String, min: 3, max: 200, required: true, alphanum: true, trim: true },
    Address:{
        country: {type:String, required:true},
        state: {type:String, required:true},
        city: {type:String, required:true}
    },
    MobileNo: { type: String, required: true },
    UserLogin: {
        EmailId: { type: String, required: true, unique: true },
        Password: { type: String, required: true }
    },
    isAdmin:{type:Boolean}
});

userSchema.methods.UserToken = function(){
    let token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get("apitoken"));
    return token;
}

let userModel = mongoose.model("users", userSchema);

function ValidationError(error) {
    let Schema = Joi.object({
        FirstName: Joi.string().min(3).max(200).required(),
        LastName: Joi.string().min(3).max(200).required(),
        Address:{
          country: Joi.string().required(),
          state: Joi.string().required(),
          city: Joi.string().required()  
        },
        MobileNo: Joi.string().required(),
        UserLogin: {
            EmailId: Joi.string().required().email(),
            Password: Joi.string().required()
        }
    });
    return Schema.validate(error);
};

module.exports = {userModel, ValidationError};