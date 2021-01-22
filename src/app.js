import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';

//Routes
import initial_attributes from './routes/initial_attributes';

const app = express();

//Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use(initial_attributes);

export default app;