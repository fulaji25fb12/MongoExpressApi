let express = require("express");
let app = express();
let mongoose = require("mongoose");
let config = require("config");
let user = require("./routes/user");
let auth = require("./routes/auth/auth");
let mailer = require("./routes/mailer");
let forgotpassword = require("./routes/forgot.password");
let pagination = require("./routes/pagination");
let port = process.env.PORT || 4600;
app.use(express.json());
if(!config.get("apitoken")){
    process.exit(1);
}
mongoose
    .connect("mongodb://localhost/UDH", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`connected to db`))
    .catch(error => console.log(`something went wrong ${error.message}`));
app.listen(port, () => console.log(`connected to port`));

app.use("/api", user);
app.use("/api/userlogin", auth);
app.use("/api", mailer);
app.use("/api", forgotpassword);
app.use("/api", pagination);