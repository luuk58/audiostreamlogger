const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const cron = require('node-cron');

const audioDirectory = path.join(__dirname, `/audio`);

function generatePeakFiles() {
    // Get current date-time in "YYYY-MM-DD-HH" format, same as the format used in the audio file names
    const now = new Date();
    const currentDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}`;

    // Loop through the subdirectories of the audio directory
    fs.readdirSync(audioDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .forEach(dirent => {
          const outputFolder = path.join(audioDirectory, dirent.name);

          fs.readdirSync(outputFolder)
            .filter(file => path.extname(file) === '.mp3')
            .forEach(file => {
                const filename = path.basename(file, '.mp3');
                const jsonFilePath = path.join(outputFolder, `${filename}.json`);

                // Extract date-time from this specific filename
                const fileDateTime = filename.match(/\d{4}-\d{2}-\d{2}-\d{2}/)[0];

                // Skip the file if its date-time matches the current date-time
                if (fileDateTime === currentDateTime) {
                    return;
                }

                if (!fs.existsSync(jsonFilePath)) {
                    const mp3FilePath = path.join(outputFolder, file);
                    const command = `audiowaveform -i "${mp3FilePath}" -o "${jsonFilePath}" --pixels-per-second 20 --bits 8`;

                    try {
                        execSync(command);
                    } catch (error) {
                        console.error(`Error executing audiowaveform for ${mp3FilePath}: ${error}`);
                    }
                }
            });
      });
}

// Schedule the generatePeakFiles function to run every hour at xx:03
cron.schedule('3 * * * *', () => {
    console.log(`Running scheduled peak file generation at ${new Date().toISOString()}`);
    generatePeakFiles();
});

console.log("Scheduler setup complete. Peak file generation process will run every hour at xx:03.");