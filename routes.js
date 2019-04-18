const router = require('express').Router();
const User = require('./models/user');
const ObjectId = require('mongoose').Types.ObjectId;
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path')
const moment = require('moment');
const mdq = require('mongo-date-query');

router.get('/', function (req, res, next) {
    User.find({beauty: {$size: 1}})
        .limit(10)
        .lean()
        .then(function (users) {
            const fields = [
                {
                    label: 'username',
                    value: 'user_name',
                    stringify: true
                },
                {
                    label: 'email',
                    value: 'email',
                    stringify: true
                },
                {
                    label: 'level',
                    value: 'user_level',
                    stringify: true
                },
                {
                    label: 'beauty_profile',
                    value: 'beauty.name',
                    stringify: true
                },
                {
                    label: 'beauty_profile_value',
                    value: 'beauty.subtags.name',
                    stringify: true
                }
            ];
            const json2csvParser = new Parser({fields, unwind: ['beauty', 'beauty.subtags']});
            const csv = json2csvParser.parse(users);
            
            const dateTime = moment().format('YYYYMMDDhhmmss');
            const filePath = path.join(__dirname, "exports", "csv-" + dateTime + ".csv");
            fs.writeFile(filePath, csv, function (err) {
                if (err) {
                    res.json(err).status(500);
                }
                else {
                    setTimeout(function () {
                        fs.unlinkSync(filePath);
                    }, 30000)
                    res.json("/exports/csv-" + dateTime + ".csv");
                }
            });
        })
        .catch(next);
});

router.get('/user-have-most-bp', function (req, res, next) {
    let agg = [
        {
            $project: {
                id: {
                    _id: "$_id", 
                    username: "$user_name", 
                    email: "$email"
                },
                count: { $size: { $ifNull: ["$beauty", []] } },
                _id: 0,
            }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ];

    User.aggregate(agg)
        .allowDiskUse(true)
        .then(function (result) {
            let user = result[0];
            User.find({ _id: new ObjectId(user.id._id) })
                .then(function (result) {
                    res.send(result);
                })
                .catch(next);
        })
        .catch(next);
});

module.exports = router;