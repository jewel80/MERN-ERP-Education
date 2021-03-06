const mongoose = require('../config/mongodb');

const {
    Schema
} = mongoose;

const DeductionsSchema = Schema({
    name: {
        type: String
    },
    amount: {
        type: String
    },
    staff: {
        type: Array
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("deductions", DeductionsSchema)