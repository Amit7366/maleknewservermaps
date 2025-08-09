const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    // Define your fields here (e.g., name, email, role, etc.)
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true
    },
    // Add other fields you need here
}, {
    timestamps: true // This automatically adds `createdAt` and `updatedAt` fields
});

const UserModel = mongoose.model('Users', userSchema);

module.exports = UserModel;