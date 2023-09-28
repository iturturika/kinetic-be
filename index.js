import express from "express";
import mongoose from "mongoose";

import { register, login, getUser } from "./controllers/UserController.js";
import {registerValidation} from './validations/auth.js';
import checkAuth from "./utils/checkAuth.js";

mongoose.connect(
    'mongodb+srv://kinetic:Iturturika-89@kinetic.knfb8wc.mongodb.net/kineticDB?retryWrites=true&w=majority'
).then(() => {
    console.log('DB Connected');
}).catch((err) => {
    console.log("DB error: ", err);
})

const app = express();

app.use(express.json()); // дает возможность работать с json

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/auth/login', login);

app.post('/auth/register', registerValidation, register);

app.get('/auth/me', checkAuth, getUser);

app.listen(4444, (err) => {
    if(err){
        return console.log(err);
    } else {
        return console.log('Ok');
    }
});