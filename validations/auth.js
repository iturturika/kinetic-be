import {body} from 'express-validator';

export const registerValidation = [
    body('login', 'Логин должен быть больше 3 символов').isLength({min: 3}),
    body('password', 'Пароль должен быть больше 8 символов').isLength({min: 8}),
];
