const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
title:{type:String, required:true},
body:{type:String},
tags:[String]
},{ timestamps:true });
module.exports = mongoose.model('Post', PostSchema);