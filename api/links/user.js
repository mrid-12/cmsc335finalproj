const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });  
const uri = process.env.MONGO_CONNECTION_STRING;
const { MongoClient, ServerApiVersion } = require('mongodb');
const axios = require('axios');

async function deleteAll() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        await client.db('CMSC335DB').collection('players').deleteMany({});
        await client.close();
    } catch (error) {
        console.error("Error deleting all applications:", error);
    }
};

async function saveApplication(applicantData) {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        const { username, score } = applicantData;
        const randomOneToHundreds = Math.floor(Math.random() * 100) + 1;
        console.log("Random number generated:", randomOneToHundreds);
        let newScore = Math.abs(score - randomOneToHundreds);
        
        let quote = 'loading....';
        if (newScore > 55) {
            const quoteResponse = await axios.get('https://v2.jokeapi.dev/joke/Dark?amount=1&format=txt&type=twopart&blacklistFlags=nsfw,sexist'); 
            console.log(quoteResponse.data);
            quote = `Here's your Dark joke for the deep dark you have ventured in:\n${quoteResponse.data}`;
        } else if (newScore > 25) {
            const quoteResponse = await axios.get('https://v2.jokeapi.dev/joke/Programming?amount=1&format=txt&type=twopart&blacklistFlags=nsfw,sexist');
            console.log(quoteResponse.data); 
            quote = `Here's your Programming joke for you will always be bugged by the never ending goal:\n${quoteResponse.data}`;
        } else if (newScore > 5) {
            const quoteResponse = await axios.get('https://v2.jokeapi.dev/joke/Christmas?amount=1&format=txt&type=twopart&blacklistFlags=nsfw,sexist');
            console.log(quoteResponse.data); 
            quote = `Here's your Christmas joke for you have touched our hearts:\n${quoteResponse.data}`;
        } else {
            const quoteResponse = await axios.get('https://v2.jokeapi.dev/joke/Spooky?amount=1&format=txt&type=twopart&blacklistFlags=nsfw,sexist');
            console.log(quoteResponse.data); 
            quote = `Here's your Spooky joke for you have scared all of us:\n${quoteResponse.data}`;
        }

        await client.db('CMSC335DB').collection('players').insertOne({ username, score: newScore });
        await client.close();
        
        return quote;
    } catch (error) {
        console.error("Error saving application:", error);
    }
};

async function getLeaderboard() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        const users = await client.db('CMSC335DB').collection('players')
            .find()
            .sort({ 'score': 1 })
            .limit(10)
            .toArray();
        await client.close();
        return users;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
    }
};

module.exports = { saveApplication, getLeaderboard, deleteAll };
