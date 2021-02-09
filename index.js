require('dotenv').config();
const express = require('express');
const App = require('./src/app');
const ngrok = require('ngrok');
const port = process.env.PORT;

const index = new App(express(), port);
index.run();

ngrok.connect({
    proto: 'http',
    addr: process.env.PORT,
 });