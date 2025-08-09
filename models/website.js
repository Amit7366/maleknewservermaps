const mongoose = require('mongoose');
const { Schema } = mongoose;

const websiteSchema = new Schema({
    // Define your fields here (e.g., name, email, role, etc.)
    websiteName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true,
       
    },
    subdomain: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true,ref: 'Users' },
    mobileClick: {
        type: Number,
        required: true
    },
    deskstopClick: {
        type: Number,
        required: true
    },
    // Add other fields you need here
}, {
    timestamps: true // This automatically adds `createdAt` and `updatedAt` fields
});

const WebsiteModel = mongoose.model('Websites', websiteSchema);

module.exports = WebsiteModel;