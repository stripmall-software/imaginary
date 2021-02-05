const dotenv = require('dotenv');

module.exports = {
    verbose: true,
    testMatch: ['<rootDir>/test/**/*.test.js']
};
dotenv.config({ path: './.env' });
