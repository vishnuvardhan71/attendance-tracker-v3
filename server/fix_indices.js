const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const dropObsoleteIndex = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/college-attendance';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('Connected.');

        const collection = mongoose.connection.collection('attendances');

        console.log('Checking indices...');
        const indices = await collection.indexes();
        console.log('Current indices:', indices.map(i => i.name));

        const oldIndexName = 'user_1_formattedDate_1';
        if (indices.find(i => i.name === oldIndexName)) {
            console.log(`Dropping old index: ${oldIndexName}...`);
            await collection.dropIndex(oldIndexName);
            console.log('Successfully dropped old index.');
        } else {
            console.log(`Index ${oldIndexName} not found or already dropped.`);
        }

        console.log('Ensuring new index exists...');
        // This will trigger Mongoose to create indices defined in the model
        const Attendance = require('../server/models/Attendance');
        await Attendance.createIndexes();
        console.log('New indices ensured.');

        await mongoose.disconnect();
        console.log('Done.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

dropObsoleteIndex();
