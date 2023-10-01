import {body} from 'express-validator';

export const itemValidation = [
    body('title', 'Заголовок должен быть больше 4 символов').isLength({min: 4}),
    body('description', 'Описание должно быть больше 20 символов').isLength({min: 20}),
    body('price', 'Цена не может быть отрицательной').isInt(),
    body('instagramUrl', 'Введенное значение не являеться ссылкой').isURL(),
]