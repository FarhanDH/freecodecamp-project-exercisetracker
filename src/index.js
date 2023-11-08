const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes/tracker.route');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use('/', router);

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});
