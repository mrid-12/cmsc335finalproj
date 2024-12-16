const express = require('express');
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });  
const uri = process.env.MONGO_CONNECTION_STRING;
const { MongoClient, ServerApiVersion } = require('mongodb');


async function saveApplication(applicantData) {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        const { username, score } = applicantData;
        const randomOneToHundreds = Math.floor(Math.random() * 100) + 1;
        newScore = score - randomOneToHundreds;
        if (newScore < 0) {
            newScore = -newScore;
        }
        await client.db('CMSC335DB').collection('players').insertOne({ username, score });    
    } catch (error) {
        console.error("Error saving application:", error);
    }
    console.log("Application saved successfully:", applicantData);
};

async function getLeaderboard() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        const users = await client.db('CMSC335DB').collection('players').find().sort({'score' : -1}); // Closest numbers (low scores)
        console.log(users);
        return users;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
    }
};


module.exports = { saveApplication, getLeaderboard };
