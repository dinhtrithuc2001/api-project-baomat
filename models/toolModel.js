const mongoose = require("mongoose");

const toolSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a tool name"]
    },
    type: {
        type: String,
        required: [true, "Please specify the type of tool (Encode/Decode, Hex, Md5)"],
        enum: ["Text", "Hex", "Md5"]
    },
    description: {
        type: String,
        required: [false]
    }
}, {
    timestamps: true
});

const Tool = mongoose.model('Tool', toolSchema);

module.exports = Tool;