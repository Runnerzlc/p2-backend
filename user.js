const fs = require(`fs`);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//mongoose.set('useFindAndModify', false);

const userSchema = new Schema({
    avatar : { data: Buffer, contentType: String },//<Binary Data>
    name : String,
    rank : String,
    gender : String,
    startDate: { type: Date, default: Date.now },
    phone : Number,
    email : String,
    suprerior : { type: Schema.Types.ObjectId, ref: 'User' },
    subordinates  : [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

module.exports = mongoose.model('User', userSchema);