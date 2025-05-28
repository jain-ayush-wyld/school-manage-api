const express = require('express');
const bodyParser = require('body-parser');
const schoolRoutes = require('./routes/school');
const app = express();

// require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config();
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', schoolRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
