import ParticipantModel from '../models/Participant.js'
import {validationResult} from 'express-validator';
export const Participate = async (req, res) => {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
          return res.status(400).json(errors.array());
      }

      const doc = new ParticipantModel({
          nickname: req.body.nickname,
          description: req.body.description,
      });
  
      const participant = await doc.save();
      res.status(200).json({
        msg: 'Готово, вы участвуете!'
    });
    } catch (err) {
      res.status(500).json({
          msg: 'Не удалось поучаствовать'
      });
    }
}




export const getRandomParticipant = async (req, res) => {
    try {
        const totalDocuments = await ParticipantModel.countDocuments();
        const randomSkip = Math.floor(Math.random() * (totalDocuments));
    
        const randomObject = await ParticipantModel.findOne().skip(randomSkip);
        res.json(randomObject);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
}

export const getCountOfParticipants = async (req, res) => {
    try {
        const totalDocuments = await ParticipantModel.countDocuments();
        res.json(totalDocuments);
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
}