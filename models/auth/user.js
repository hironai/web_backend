const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES, ORGANIZATIONTYPE } = require('../../constants/APPLICATION');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (value) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: 'Invalid email format',
            },
        },
        password: {
            type: String,
            select: false,
        },
        userName: {
            type: String,
            unique: true,
            required: true
        },
        role: {
            type: String,
            enum: ROLES,
            default: 'Candidate',
            immutable: true
        },
        contactPerson: { type: String, default: "", trim: true },
        organizationType: { type: String, enum: ORGANIZATIONTYPE, default: "Other" },
        organizations: [
            {
                organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                invitedOn: { type: Date },
                acceptedOn: { type: Date },
                isAccepted: { type: Boolean }
            }
        ],
        isVerified: { type: Boolean, default: false },
        referId: { type: String },
        isPasswordSet: { type: Boolean, default: true, select: false },
        isWelcomeSent: { type: Boolean, default: false },
        lastActive: { type: Date, default: new Date() },
        referBY: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

// ✅ Generate Unique Username Before Saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') && !this.isModified('userName')) return next(); // Skip if no relevant change

    // Generate Hash for Password
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

// ✅ Compare Password Method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.index({
    name: "text",
    email: "text",
    userName: "text"
});


// ✅ Create & Export User Model
const User = mongoose.model('User', userSchema);
module.exports = User;
