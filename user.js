const fs = require(`fs`);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//mongoose.set('useFindAndModify', false);

const userSchema = new Schema({
    avatarUrl : String,
    //{ data: Buffer, contentType: String },//<Binary Data>
    name : String,
    rank : String,
    gender : String,
    selectDate: String,
    phone : Number,
    email : String,
    superior : { type: Schema.Types.ObjectId, ref: 'User' },
    subordinates  : [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

module.exports = mongoose.model('User', userSchema);