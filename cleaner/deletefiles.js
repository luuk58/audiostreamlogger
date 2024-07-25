const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const folder = "/audio";
const folderPath = path.join(__dirname, folder);
const thresholdTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

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