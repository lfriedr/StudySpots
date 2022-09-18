const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
//to use with passport for authentication (username and password)
UserSchema.plugin(passportLocalMongoose);
//compile model
module.exports = mongoose.model('User', UserSchema); 