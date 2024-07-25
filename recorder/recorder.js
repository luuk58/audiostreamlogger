const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const cron = require('node-cron');

// Function to execute ffmpeg command using fluent-ffmpeg
function recordStream(name, folder, url) {
    const audioFolderPath = path.join(__dirname, `./audio/${folder}`);
    fs.mkdirSync(audioFolderPath, { recursive: true });

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getHours()).padStart(2, '0')}`;
    const outputPath = `${audioFolderPath}/${folder}-${formattedDate}.mp3`;

    ffmpeg()
        .input(url)
        .inputOptions('-user_agent', `'${name} Logger'`)
        .duration('01:00:00')
        .audioFrequency(44100)
        .audioBitrate('160k')
        .output(outputPath)
        .on('start', (commandLine) => {
            console.log(`Started recording for ${name} in folder ${folder}: ${commandLine}`);
        })
        .on('error', (err) => {
            console.error(`Error: ${err.message}`);
        })
        .on('end', () => {
            console.log(`Recording finished for ${name} in folder ${folder}`);
        })
        .run();
}

// Function to read settings and start recording
function startRecording() {
    const json = JSON.parse(fs.readFileSync(path.join(__dirname, '/settings.json'), 'utf8'));
    const streams = json.streams;
    streams.forEach(item => {
        recordStream(item.name, item.folder, item.url);
    });
}

// Schedule the startRecording function to run at the beginning of every hour
cron.schedule('0 0 * * * *', () => {
    console.log('Starting recording at the beginning of the hour');
    startRecording();
});