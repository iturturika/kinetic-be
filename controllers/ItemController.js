import { validationResult } from "express-validator";
import ItemModel from "../models/Item.js";
import fs from 'fs';

export const addItem = async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json(errors.array());
        }

        const doc = new ItemModel({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            size: req.body.size,
            instagramUrl: req.body.instagramUrl,
            categories: req.body.categories,
            label: req.body.label,
            imagePaths: req.files.map(file => file.path)
        });
    
        const item = await doc.save();

        res.json({
            msg: 'Success'
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Не удалось добавить товар'
        });
    }
}

function deleteImages(imagePaths) {
    imagePaths.forEach((imagePath) => {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Изображение ${imagePath} удалено успешно`);
        }
      });
    });
}

export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await ItemModel.findOne({_id: itemId});
        const imagePaths = (item.imagePaths);
        if(!item) {
            return res.status(404).json({
                msg: 'Не удалось найти товар'
            });
        }

        deleteImages(imagePaths);
        await ItemModel.findByIdAndDelete(itemId);

        res.json({
            msg: "Success"
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Не удалось удалить товар'
        });
    }
}

export const getItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await ItemModel.findOne({_id: itemId});
        if(!item) {
            return res.status(404).json({
                msg: 'Не удалось найти товар'
            });
        }
        res.send(item);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Не удалось найти товар'
        });
    }
}

export const getAll = async (req, res) => {
    try {

        const searchParams = [
            {title: { $regex: req.query.title, $options: 'i' }},
            {categories: { $regex: req.query.categories }},
            {label: { $regex: req.query.label }},
            {status: { $regex: req.query.status }},
        ];

        const item = await ItemModel.find({ $or: searchParams });

        if(!item) {
            return res.status(404).json({
                msg: 'Не удалось вернуть список товаров'
            });
        }

        return res.send(item);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Не удалось найти товар'
        });
    }
}

export const updateItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        await ItemModel.findOneAndUpdate({
            _id: itemId,
        }, {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            size: req.body.size,
            instagramUrl: req.body.instagramUrl,
            categories: req.body.categories,
            label: req.body.label,
            imagePaths: req.files.map(file => file.path)
        });

        res.json({
            msg: 'Success',
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Не удалось обновить товар'
        });
    }
}