const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    discussion_id: {
        required: true,
        type:mongoose.Schema.Types.ObjectId
    },
    content: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('MediaData', dataSchema)