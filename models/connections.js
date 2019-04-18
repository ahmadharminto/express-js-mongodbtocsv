const mongoose = require('mongoose');

mongoose.account = mongoose.createConnection(process.env.DB_HOST_ACCOUNT, {
    auth: {
        user: process.env.DB_USER_ACCOUNT,
        password: process.env.DB_PASS_ACCOUNT
    },
    useNewUrlParser: true
});

mongoose.soco = mongoose.createConnection(process.env.DB_HOST_SOCO, {
    auth: {
        user: process.env.DB_USER_SOCO,
        password: process.env.DB_PASS_SOCO
    },
    useNewUrlParser: true
});

mongoose.Promise = global.Promise;

module.exports = mongoose;