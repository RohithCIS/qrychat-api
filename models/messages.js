var mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
    id: String,
    name: String,
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    messages: [{
        mtype: String,
        name: String,
        message: String,
        date: Date
    }]
})

var Chats = mongoose.model('Chats', chatSchema);
module.exports = Chats;