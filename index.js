const express = require('express');
const App = require('./src/app');
const port = 3000;

const index = new App(express(), port);
index.run();