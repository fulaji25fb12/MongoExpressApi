function Admin(req,res,next){
    if(!req.user.isAdmin){return res.status(402).send({message: "ACCESS DENIED! ADMIN"})};
    next();
}
module.exports = Admin;