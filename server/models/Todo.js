const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', new mongoose.Schema({
    name: String,
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}))

module.exports = Todo;