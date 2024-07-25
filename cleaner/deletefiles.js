const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// Path to the settings.json file
const settingsPath = '/usr/src/app/settings.json';

// Read and parse the settings.json file
let settings;
try {
    const settingsData = fs.readFileSync(settingsPath, 'utf8');
    settings = JSON.parse(settingsData);
} catch (err) {
    console.error('Error reading settings.json:', err);
    process.exit(1);
}

// Access the log_retention variable
const logRetention = settings.log_retention;

const folder = "/audio";
const folderPath = path.join(__dirname, folder);
const thresholdTime = new Date(Date.now() - logRetention * 60 * 60 * 1000);

console.log(`Starting to delete files older than ${thresholdTime.toISOString()}.`);

// Function to delete files older than thresholdTime
function deleteOldFiles(dir) {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${dir}:`, err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(dir, file.name);
            if (file.isDirectory()) {
                // Recursively check subdirectories
                deleteOldFiles(filePath);
            } else {
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.error(`Error getting stats for file ${filePath}:`, err);
                        return;
                    }
                    if (stats.mtime < thresholdTime) {
                        console.log(`Deleting: ${filePath}`);
                        fs.unlink(filePath, err => {
                            if (err) console.error(`Error deleting file ${filePath}:`, err);
                        });
                    }
                });
            }
        });
    });
}

// Schedule the deleteOldFiles function to run every hour at xx:05
cron.schedule('5 * * * *', () => {
    console.log(`Running scheduled file deletion at ${new Date().toISOString()}`);
    deleteOldFiles(folderPath);
});

console.log("Scheduler setup complete. File deletion process will run every hour at xx:05.");