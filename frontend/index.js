const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 80;

/*
 --------- --------- --------- Settings --------- --------- ---------
*/
const apiRouter = require('./routes/api');
const utilRouter = require('./routes/util');
app.use(cors());

/*
 --------- --------- --------- Routes --------- --------- ---------
*/
app.use(express.static(path.join(__dirname, 'web')));
app.use('/audio', express.static(path.join(__dirname, 'audio')));
app.use('/api', apiRouter);
app.use('/util', utilRouter);
app.use('/logger', utilRouter);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});