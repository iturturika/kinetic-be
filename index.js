import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import path from 'path'

import { register, login, getUser } from "./controllers/UserController.js";
import { addItem, deleteItem, getAll, getItem, updateItem } from "./controllers/ItemController.js";
import {registerValidation} from './validations/auth.js';
import checkAuth from "./utils/checkAuth.js";
import { itemValidation } from "./validations/itemValidation.js";
import multer from "multer";
import { Participate, getCountOfParticipants, getRandomParticipant } from "./controllers/ParticipantController.js";
import { participantValidate } from "./validations/participantValidation.js";

mongoose.connect(
    'mongodb+srv://kinetic:Iturturika-89@kinetic.knfb8wc.mongodb.net/kineticDB?retryWrites=true&w=majority'
).then(() => {
    console.log('DB Connected');
}).catch((err) => {
    console.log("DB error: ", err);
})

const app = express();

const corsOptions = {
    origin: 'https://kineticstore.online',
    optionsSuccessStatus: 200,
  };
  
app.use(cors(corsOptions));
// app.use(cors());

app.use(express.json()); // дает возможность работать с json

app.use('/uploads', express.static('uploads'));



// Указываем место для сохранения загруженных файлов
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, 'uploads/'); // Здесь 'uploads/' - это папка, куда будут сохраняться загруженные файлы
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
      },
});
  
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send('Kinetic-be - Server ok');
});

app.post('/auth/login', login);

app.post('/auth/register', registerValidation, register);

app.get('/auth/me', checkAuth, getUser);

app.post('/items', upload.array('images', 4), itemValidation, addItem);

app.delete('/items/:id', checkAuth, deleteItem);

app.get('/items/:id', getItem);

app.get('/items', getAll);

app.patch('/items/:id', checkAuth, upload.array('images', 4), itemValidation, updateItem);

app.post('/participants', participantValidate, Participate);


app.get('/random-participant', checkAuth, getRandomParticipant);

app.get('/count', getCountOfParticipants);

app.listen(8080, (err) => {
    if(err){
        return console.log(err);
    } else {
        return console.log('Ok, server started at port = ' + 8080);
    }
});

