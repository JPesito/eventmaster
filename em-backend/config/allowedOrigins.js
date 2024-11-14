require('dotenv').config();

const allowedOrigins = [
  process.env.REACT_APP_API_BASE_URL,
  'http://10.0.0.163:3002',
  'http://10.0.0.163:3000',
  'http://localhost:3002',
];

module.exports = allowedOrigins;