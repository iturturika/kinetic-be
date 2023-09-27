import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import {validationResult} from 'express-validator';

import {registerValidation} from './validations/auth.js';

import UserModel from "./models/User.js";

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

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({login: req.body.login});

        if(!user){
            return res.status(404).json({
                msg: 'Пользователь не найден'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.password);

        if(!isValidPass) {
            return res.status(404).json({
                msg: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'kineticsecretkey', {
            expiresIn: '30d'
        });

        res.json({
            token: token,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Не удалось авторизоваться'
        });
    }
});

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
        login: req.body.login,
        password: passwordHash,
    });

    const user = await doc.save();

    const token = jwt.sign({
        _id: user._id,
    }, 'kineticsecretkey', {
        expiresIn: '30d'
    });

    res.json({
        token: token,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
        msg: 'Не удалось зарегистрироваться'
    });
  }
});

app.listen(4444, (err) => {
    if(err){
        return console.log(err);
    } else {
        return console.log('Ok');
    }
});