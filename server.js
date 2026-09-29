const express = require('express');
const app = express();
const envelopeRoutes = require('./routes/envelopes');
const store = require('./data/envelopes');

app.get('/', (req, res) => {
    res.send('Envelope API is running');
});

const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use('/envelopes', envelopeRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});