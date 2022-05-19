const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    user_id: {
        required: true,
        type: Number
    },
    course_module_id: {
        required: true,
        type: Number
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    content: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Data', dataSchema)