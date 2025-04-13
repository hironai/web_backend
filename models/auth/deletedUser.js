const mongoose = require('mongoose');

const deletedUserSchema = new mongoose.Schema({
     user: { type: Object, required: true }
}, { timestamps: true });

// module.exports = mongoose.model('DeletedUser', deletedUserSchema);
const DeletedUser = mongoose.model('DeletedUser', deletedUserSchema);

module.exports = DeletedUser;
