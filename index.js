import express from "express";
import mongoose from "mongoose";

import { register, login, getUser } from "./controllers/UserController.js";
import { addItem, deleteItem, getAll, getItem, updateItem } from "./controllers/ItemController.js";
import {registerValidation} from './validations/auth.js';
import checkAuth from "./utils/checkAuth.js";
import { itemValidation } from "./validations/itemValidation.js";
import multer from "multer";

mongoose.connect(
    'mongodb+srv://kinetic:Iturturika-89@kinetic.knfb8wc.mongodb.net/kineticDB?retryWrites=true&w=majority'
).then(() => {
    console.log('DB Connected');
}).catch((err) => {
    console.log("DB error: ", err);
})

const app = express();

app.use(express.json()); // дает возможность работать с json

app.use('/uploads', express.static('uploads'));

// Указываем место для сохранения загруженных файлов
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, 'uploads/'); // Здесь 'uploads/' - это папка, куда будут сохраняться загруженные файлы
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname); // Здесь 'uploads/' - это папка, куда будут сохраняться загруженные файлы
      },
  });
  
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/auth/login', login);

app.post('/auth/register', registerValidation, register);

app.get('/auth/me', checkAuth, getUser);

app.post('/items', upload.array('images', 4), itemValidation, addItem);

app.delete('/items/:id', deleteItem);

app.get('/items/:id', getItem);

app.get('/items', getAll);

app.patch('/items/:id', upload.array('images', 4), itemValidation, updateItem);

app.listen(4444, (err) => {
    if(err){
        return console.log(err);
    } else {
        return console.log('Ok');
    }
});

