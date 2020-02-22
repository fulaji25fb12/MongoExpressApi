let express = require("express");
let router = express.Router();
let User = require("../dbModel/user");
let bcrypt = require("bcrypt");
let auth = require("./middleware/user.auth");
let admin = require("./middleware/admin");
//fetch data
router.get("/fetchuser",auth, async (req, res) => {
    let data = await User.userModel.find();
    res.send({ d: data });
});
//fetch data by id
router.get("/fetchuser/:id",auth, async (req, res) => {
    let user = await User.userModel.findById(req.params.id);
    if (!user) { return res.status(404).send({ message: "Invalid user id" }) };
    res.send({ data: user });
});

//create data
router.post("/createuser", async (req, res) => {
    let user = await User.userModel.findOne({"UserLogin.EmailId": req.body.UserLogin.EmailId});
    if (user) {return res.status(403).send({message:"user already exists in our system"})};
    let { error } = User.ValidationError(req.body);
    if (error) { return res.send(error.details[0].message) };
    let newuser = new User.userModel({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Address: req.body.Address,
        MobileNo: req.body.MobileNo,
        UserLogin: req.body.UserLogin
    });
    let salt = await bcrypt.genSalt(10);
    newuser.UserLogin.Password = await bcrypt.hash(newuser.UserLogin.Password, salt);
    let data = await newuser.save();
    res.send({ message: "THANK YOU!" , d: data});
});

//update data
router.put("/updateuser/:id",auth, async (req, res) => {
    let user = await User.userModel.findById(req.params.id);
    if (!user) { return res.status(404).send({ message: "Invalid user id" }) };
    let { error } = User.ValidationError(req.body);
    if (error) { return res.send(error.details[0].message) };
    user.FirstName = req.body.FirstName;
    user.LastName = req.body.LastName;
    user.Address.country = req.body.Address.country;
    user.Address.state = req.body.Address.state;
    user.Address.city = req.body.Address.city;
    user.MobileNo = req.body.MobileNo;
    user.UserLogin.EmailId = req.body.UserLogin.EmailId;
    user.UserLogin.Password = req.body.UserLogin.Password;
    let salt = await bcrypt.genSalt(10);
    user.UserLogin.Password = await bcrypt.hash(user.UserLogin.Password, salt);
    await user.save();
    res.send({ message: "Data updated" });
});

//remove data
router.delete("/removeuser/:id",[auth,admin], async (req, res) => {
    let user = await User.userModel.findByIdAndRemove(req.params.id);
    if (!user) { return res.status(404).send({ message: "Invalid user id" }) };
    res.send({message:"THANK YOU ! COME BACK AGAIN :("})
});


module.exports = router;