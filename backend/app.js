const express = require('express');
const cors = require('cors');

const app = express();

require('dotenv').config();

// ✅ CORS (this alone is enough)
app.use(cors());

app.use(express.json());

const routes = require("./routes/Routes");
app.use('/api', routes);

const db = require("./config/database");
db();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});