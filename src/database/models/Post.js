const mongoose = require("mongoose")

const PostSchema = mongoose.Schema({
    usernameId : {
        type :String,
        required : true
    },
    tittle : {
        type :String,
        required : false
    },
    dateCreated : {
        type : new Date("<YYYY-mm-ddTHH:MM:ss>"),
        required : false
    },
    photoId : {
        type : String,
        required : true
    },
    isFriendly :{
        type : Boolean,
        required : true
    }
})

const Post = mongoose.model('Post',PostSchema)

module.exports = Post