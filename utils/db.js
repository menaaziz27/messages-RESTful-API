const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose
	.connect('YOUR_DATABASE_URL')
	.then(client => {
		console.log('connected to db');
	})
	.catch(e => console.log(e));
