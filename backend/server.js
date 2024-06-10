const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const actionRoutes = require('./routes/actions');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/actionRecorder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use(cors());
app.use(bodyParser.json());
app.use('/api', actionRoutes);
app.use('/api', authRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
