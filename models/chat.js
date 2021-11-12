

const { Schema, model } = require('mongoose');




var room = Schema({
    name: { type: String, lowercase: true, unique: true },
    topic: String,
    users: [user],
    messages: [message],
    created_at: Date,
    updated_at: { type: Date, default: Date.now },
    });

var message = new mongoose.Schema({
    room: room,
    user: user,
    message_body: String,
    message_status:{type: Boolean, default: false},
    created_at: { type: Date, default: Date.now },
    });


var Message = model('Message', message);
module.exports = model( 'Room', room);