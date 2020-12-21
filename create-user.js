const mongoose = require('mongoose');
const cmdline = require('command-line-args');

const mongodb = process.env["MONGO_URL"];

const optionDefinitions = [
	{ name: "appname", type: String},
	{ name: "username", type: String},
	{ name: "email", type: String},
	{ name: "password", type: String}
];

const options = cmdline(optionDefinitions)

if (!options.appname || !options.email || !options.password) {
	console.log("you need to pass appname, email and password");
	process.exit();
}

var mongoose_options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

mongoose.connect(mongodb, mongoose_options)
.then(() => {
	console.log("Connected to the DB " + mongodb);
})
.catch( err => {
	console.log("failed to connect to DB " + mongodb);
	process.exit(-1);
});

const Users = require('./models/users');

var u = new Users({
	appname: options.appname,
	username: options.userid || "admin",
	email: options.email,
	permissions: "*"
});

u.setPassword(options.password)
.then(() => {
	return u.save()
})
.then(() => {
	console.log("finished");
	mongoose.connection.close();
})