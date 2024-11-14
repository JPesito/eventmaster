const express = require('express');
const cors = require('cors');
const allowedOrigins = require('./config/allowedOrigins');
const authRoutes = require('./routes/authRoutes');
const eventsRoutes = require('./routes/eventsRoutes');

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    callback(new Error('The CORS policy does not allow access from this origin.'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', eventsRoutes);

module.exports = app;
