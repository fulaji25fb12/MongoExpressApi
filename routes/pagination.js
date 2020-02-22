let express = require("express");
let router = express.Router();
let User = require("../dbModel/user");

router.post("/pagination/:page", async(req,res) => {
    let perpage = 10;
    let currentPage = req.params.page || 1;
    let data = await User.userModel
        .find()
        .skip((perpage * currentPage) - perpage) //1-10 11-20- 50
        .limit(perpage);
    let totalcount = await User.userModel.find().count();
    let totalPages = Math.ceil(totalcount/perpage);
    res.send({
        perpage: perpage,
        currentPage: currentPage,
        data: data,
        totalcount: totalcount,
        totalPages: totalPages
    })
});

module.exports = router;