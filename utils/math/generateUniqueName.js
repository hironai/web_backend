const User = require("../../models/auth/user");

// ✅ Helper Function to Generate Unique Usernames
// const generateUniqueUserName = async (name) => {
//     let baseUsername = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
//     let username = baseUsername;
//     let count = 1;

//     // Check if username exists & append a number if needed
//     while (await User.exists({ userName: username })) {
//         username = `${baseUsername}-${count}`;
//         count++;
//     }

//     return username;
// }



const UserCounter = require("../../models/auth/userCounter"); // Import the counter model

const generateUniqueUserName = async (name) => {
    let baseName = name.toLowerCase().replace(/\s+/g, ""); // Normalize name

    // Fetch or create a unique counter for the username
    const counter = await UserCounter.findOneAndUpdate(
        { baseName }, // Find the counter for this name
        { $inc: { counter: 1 } }, // Increment the counter atomically
        { upsert: true, new: true } // Create it if it doesn't exist
    );

    return `${baseName}${counter.counter}`; // Generate final username (e.g., ankit1, ankit2)
};



module.exports = generateUniqueUserName;