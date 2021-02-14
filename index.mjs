import dotenv from 'dotenv';
import express from 'express';
import App from './src/app.mjs';
dotenv.config();
const app = express();
const port = process.env.PORT;
const index = new App(app, port);

index.run();