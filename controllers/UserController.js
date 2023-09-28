import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {validationResult} from 'express-validator';

import UserModel from '../models/User.js'

export const register = async (req, res) => {
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
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({login: req.body.login});

        if(!user){
            return res.status(404).json({
                msg: 'Пользователь не найден'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.password);

        if(!isValidPass) {
            return res.status(400).json({
                msg: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'kineticsecretkey', {
            expiresIn: '30d'
        });

        res.json({
            ...user._doc,
            token: token,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Не удалось авторизоваться'
        });
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if(!user){
            return res.status(404).json({
                msg: 'Пользователь не найден',
            })
        }
        res.json({
            success: true,
            ...user._doc
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({
            msg: 'Нет доступа'
        });
    }
}