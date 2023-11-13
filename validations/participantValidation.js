import {body} from 'express-validator';

export const participantValidate = [
    body('nickname', 'Instagram должен быть больше 3 символов').isLength({min: 3}),
    body('description', 'Ответ должен быть больше 5 символов').isLength({min: 5}),
];
