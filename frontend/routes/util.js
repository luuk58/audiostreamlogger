const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

router.use(express.json());

router.post('/selection-export', (req, res) => {
    const data = req.body;

    // Extract data from the request
    const { station_id, year, month, day, hour, startTime, endTime } = data;
    const file = `${station_id}/${station_id}-${year}-${month}-${day}-${hour}.mp3`;

    // Validate the inputs
    if (!startTime || !endTime || !file) {
        return res.status(400).send('Missing required parameters');
    }

    // Set the path to the MP3 file
    const pathToFile = path.join(__dirname, `../audio/${file}`); // Use absolute path
    const pathToOutput = path.join(__dirname, `../audio/temp-${Date.now()}.mp3`); // Use absolute path
    // Check if the file exists
    if (!fs.existsSync(pathToFile)) {
        return res.status(404).send('File not found');
    }
    console.log(pathToOutput);
    // Use FFmpeg to extract the part of the MP3
    ffmpeg(pathToFile)
        .setStartTime(startTime)
        .setDuration(endTime - startTime)
        .output(pathToOutput)
        .on('end', function () {
            // Send the file when processing is finished
            res.sendFile(pathToOutput, () => {
                // Delete the temporary file
                fs.unlinkSync(pathToOutput);
                console.log(pathToOutput);
            });
        })
        .on('error', function (err) {
            console.log('Error: ' + err.message);
            res.status(500).send('Error processing file');
        })
        .run();
});

module.exports = router;