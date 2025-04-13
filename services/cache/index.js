const { redisClient } = require('../../db/redis');

// Set data in Redis
const setCache = async (key, value, expiry = 3600) => {
    await redisClient.set(key, JSON.stringify(value), {
        EX: expiry, // Expiration time in seconds
    });
};

// Get data from Redis
const getCache = async (key) => {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : {};
};

// Delete data from Redis
const deleteCache = async (key) => {
    await redisClient.del(key);
};

const getmatricCache = async (key) => {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
};


const getMediaByCategory = async (category, limit, page) => {
    const cacheKey = "mediaFiles";
    const skip = (page - 1) * limit;

    // Fetch the mediaFiles object from Redis
    const mediaFilesString = await redisClient.get(cacheKey);

    if (!mediaFilesString) {
        console.log(`No cached media found for key: ${cacheKey}`);
        return null;
    }

    const mediaFiles = JSON.parse(mediaFilesString);

    // Get the data for the specified category
    const categoryData = mediaFiles[category] || {};
    const mediaIds = Object.entries(categoryData);

    // Apply pagination
    const paginatedData = mediaIds.slice(skip, skip + limit).map(([id, value]) => ({
        // id,
        ...value
    }));

    return paginatedData;
};

const deleteCacheMedia = async (mediaId, category) => {
    try {
        const redisKey = "mediaFiles";

        // Fetch the current media files structure from Redis
        const mediaFilesString = await redisClient.get(redisKey);
        const mediaFiles = JSON.parse(mediaFilesString || "{}");

        // Check if the media exists in the "all" category
        if (mediaFiles.all && mediaFiles.all[mediaId]) {
            delete mediaFiles.all[mediaId];
        }

        // Check if the media exists in the specific category
        if (mediaFiles[category] && mediaFiles[category][mediaId]) {
            delete mediaFiles[category][mediaId];

            // If the category becomes empty, you can optionally delete the category
            if (Object.keys(mediaFiles[category]).length === 0) {
                delete mediaFiles[category];
            }
        }
        // Update the Redis cache with the modified structure
        // await redisClient.set(redisKey, JSON.stringify(mediaFiles));
        await setCache(redisKey, mediaFiles);

        return true;
    } catch (error) {
        console.error(
            `Error deleting mediaId ${mediaId} from Redis:`,
            error
        );
    }
};

module.exports = { setCache, getCache, deleteCache, getmatricCache, getMediaByCategory, deleteCacheMedia };
