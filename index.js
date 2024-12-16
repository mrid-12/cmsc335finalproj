const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') }) 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_CONNECTION_STRING;
const databaseAndCollection = {db: "CMSC335DB", collection:"players"};

const PORT = 5000;
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const userRouter = require('./router/router');
app.use('/user', userRouter);

app.get('/', (req, res) => {
    res.render('index', { joke: 'The closer you are to your random number, you might find a different category joke'});
});

async function main() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    }
    app.listen(PORT, async () => {
        console.log('Server is running on port 5000');
    });
    return client;
}

main().catch(console.error);

