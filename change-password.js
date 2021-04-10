const mongoose = require('mongoose');
const cmdline = require('command-line-args');

const mongodb = process.env["MONGO_URL"];

const optionDefinitions = [
	{ name: "appname", type: String},
	{ name: "username", type: String},
	{ name: "password", type: String}
];

const options = cmdline(optionDefinitions)

if (!options.appname || !options.username || !options.password) {
	console.log("you need to pass appname, username and password");
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

	const Users = require('./models/users');

	Users.findOne({appname: options.appname, username: options.username})
	.then( user => {
		return user.setPassword(options.password)
	})
	.then( user => {
		return user.save()
	})
	.then(() =>{
		mongoose.connection.close();
		process.exit(0)
	})
	.catch (err => {
		console.log(err)
	})

})
.catch( err => {
	console.log("failed to connect to DB " + mongodb);
	process.exit(-1);
});

