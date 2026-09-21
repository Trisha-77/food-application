import fs from 'fs'
import path from 'path'
import foodModel from '../models/foodModel.js'

//add food item

const addFood = async (req,res) =>{
    if (!req.file) {
        return res.status(400).json({success:false, message:'Image is required'});
    }

    const { name, description, category } = req.body;
    const price = Number(req.body.price);
    if (!name?.trim() || !description?.trim() || !category?.trim() || !Number.isFinite(price) || price <= 0) {
        fs.unlink(req.file.path, () => {});
        return res.status(400).json({success:false, message:'Name, description, category, and a positive price are required.'});
    }
    const image_filename = req.file.filename;

    const food = new foodModel({
        name: name.trim(),
        description:description.trim(),
        price,
        category:category.trim(),
        image:image_filename
    })

    try {
        await food.save();
        res.status(201).json({success:true,message:'Food added successfully.', data:food})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:'Error'})
    }
}

const updateFood = async (req, res) => {
    try {
        const { name, description, category } = req.body;
        const price = Number(req.body.price);
        if (!name?.trim() || !description?.trim() || !category?.trim() || !Number.isFinite(price) || price <= 0) {
            if (req.file) fs.unlink(req.file.path, () => {});
            return res.status(400).json({success:false, message:'Name, description, category, and a positive price are required.'});
        }
        const food = await foodModel.findById(req.params.id);
        if (!food) {
            if (req.file) fs.unlink(req.file.path, () => {});
            return res.status(404).json({success:false, message:'Food not found.'});
        }
        const oldImage = food.image;
        food.name = name.trim(); food.description = description.trim(); food.category = category.trim(); food.price = price;
        if (req.file) food.image = req.file.filename;
        await food.save();
        if (req.file && oldImage && oldImage !== food.image) fs.unlink(path.join('uploads', oldImage), () => {});
        res.json({success:true, message:'Food item updated successfully.', data:food});
    } catch (error) {
        console.error('Food update failed:', error.message);
        if (req.file) fs.unlink(req.file.path, () => {});
        res.status(500).json({success:false, message:'Unable to update food item.'});
    }
}

// All food list

const listFood = async (req,res) =>{
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:'Error'})
    }
}

// remove food item

const removeFood = async (req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({success:false, message:'Food not found'});
        }
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:'Food Removed'})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:'Error'})
    }
}

export {addFood, listFood, removeFood, updateFood}
