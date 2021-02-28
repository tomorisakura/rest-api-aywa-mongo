require('dotenv').config();
const express = require('express');
const App = require('./src/app');
const port = process.env.PORT;

const index = new App(express(), port);
index.run();