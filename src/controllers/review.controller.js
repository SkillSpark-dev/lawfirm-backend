const Joi = require('joi')
const Review = require("../models/review.model");
const cloudinary = require("cloudinary").v2;


//validation schema - no image validation
const reviewSchema = Joi.object({
    name: Joi.string().trim().required(),
    message: Joi.string().trim().required(),
    rating: Joi.number().min(1).max(5).required()
});

//create review 
const createReview = async (req, res) => {
    const {error,value}=reviewSchema.validate(req.body, {
        allowUnknown: true,
        stripUnknown: true,
        aboutEarly: true
    });
    if(error){
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        })
    }
    if(!req.file){
        return res.status(400).json({
            success: false,
            message: "Image is required"
        })
    }
    const imageData = req.file ? {
        public_id: req.file.filename,
        url: req.file.path
    }:{
        public_id: "",
        url: ""
    };
    const newReview = new Review({...value,image:imageData});
    await newReview.save();
    res.status(201).json({ message: "Review created successfully", data: newReview });



    //get all reviews
    const getAllReviews = async (req, res) => {
        try {
            const reviews = await Review.find();
            res.status(200).json({ data: reviews });
        } catch (error) {
            next(error);
        }
    };



    //update review

    const updateReview = async (req, res) => {
        const {id}=req.params;
        const {error,value}=reviewSchema.validate(req.body, {
            allowUnknown: true,
            stripUnknown: true,
            aboutEarly: true
        });
        if(error){
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }
        const review = await Review.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json({ message: "Review updated successfully", data: review });

        if(req.file){
            if(review.image.public_id){
                await cloudinary.uploader.destroy(review.image.public_id);
            }
            const imageData = req.file ? {
                public_id: req.file.filename,
                url: req.file.path
            }:{
                public_id: "",
                url: ""
            };

            //update other fields if provided
            if(value.name) review.name=value.name;
            if(value.message) review.message=value.message;
            if(value.rating) review.rating=value.rating;
            review.image=imageData;
            await review.save();
            res.status(200).json({ message: "Review updated successfully", updatedReview: review });


        }
    };


    //delete review

    const deleteReview = async (req, res) => {
        try {
            const review = await Review.findByIdAndDelete(req.params.id);
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }
            if(review.image.public_id){
                await cloudinary.uploader.destroy(review.image.public_id);
            }
            res.status(200).json({ message: "Review deleted successfully" });
        } catch (error) {
            next(error);
        }
    };
}

module