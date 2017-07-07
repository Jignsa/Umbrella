var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var demo = new Schema({
    name: { type: String },
    password: { type: String },
    email:{type: String,required: true},
    phone:{type: Number}
});



module.exports = mongoose.model("schema", demo); //table name create demos