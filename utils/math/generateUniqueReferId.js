const crypto = require("crypto");
const User = require("../../models/auth/user");
const { REFER_BETCH_COUNT } = require("../../constants/APPLICATION");

const generateUniqueReferId = async () => {
    // Number of codes to generate in each batch
    const batchSize = REFER_BETCH_COUNT;
    let referId;

    while (true) {
        // Generate a batch of referral codes
        const codes = new Set();
        for (let i = 0; i < batchSize; i++) {
            const code = crypto.randomBytes(3).toString("hex").toUpperCase();
            codes.add(code);
        }

        // Check if any of the generated codes already exist in the database
        const existingCodes = await User.find({ referId: { $in: [...codes] } }).distinct("referId");

        // Find the first code that is not in the existing codes
        referId = [...codes].find((code) => !existingCodes.includes(code));

        if (referId) break; // If a unique code is found, break the loop
    }

    // return the referId
    return referId;
};

module.exports = generateUniqueReferId;