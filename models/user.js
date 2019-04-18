const mongoose = require('./connections');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
});

const User = mongoose.account.model('users', UserSchema);

module.exports = User;