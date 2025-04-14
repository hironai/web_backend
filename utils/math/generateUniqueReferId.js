const crypto = require("crypto");
const User = require("../../models/auth/user");
const { REFER_BETCH_COUNT } = require("../../constants/APPLICATION");

// const generateUniqueReferId = async () => {
//     // Number of codes to generate in each batch
//     const batchSize = REFER_BETCH_COUNT;
//     let referId;

//     while (true) {
//         // Generate a batch of referral codes
//         const codes = new Set();
//         for (let i = 0; i < batchSize; i++) {
//             const code = crypto.randomBytes(3).toString("hex").toUpperCase();
//             codes.add(code);
//         }

//         // Check if any of the generated codes already exist in the database
//         const existingCodes = await User.find({ referId: { $in: [...codes] } }).distinct("referId");

//         // Find the first code that is not in the existing codes
//         referId = [...codes].find((code) => !existingCodes.includes(code));

//         if (referId) break; // If a unique code is found, break the loop
//     }

//     // return the referId
//     return referId;
// };

const generateUniqueReferId = async (username) => {
    const batchSize = REFER_BETCH_COUNT;
    let referId;

    // Helper: sanitize name (remove spaces, special chars, etc.)
    const cleanName = username.replace(/[^a-zA-Z]/g, "").toUpperCase();

    // Take first 5 characters of the name (pad if too short)
    const namePart = cleanName.substring(0, 5).padEnd(5, "X");

    while (true) {
        const codes = new Set();

        for (let i = 0; i < batchSize; i++) {
            // Generate 5-digit random number
            const randomDigits = Math.floor(10000 + Math.random() * 90000); // ensures 5 digits
            const code = `${namePart}${randomDigits}`;
            codes.add(code);
        }

        const existingCodes = await User.find({ referId: { $in: [...codes] } }).distinct("referId");

        referId = [...codes].find(code => !existingCodes.includes(code));
        if (referId) break;
    }

    return referId;
};


module.exports = generateUniqueReferId;