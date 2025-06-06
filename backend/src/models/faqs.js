/*
Campos
    Question
    Answer
    Level
    isActive
*/

import { Schema, model } from "mongoose";

const faqsSchema = new Schema(
    {
        question: {
            type: String,
            required: true,
            minLength: 4,
            trim: true
        },
        answer: {
            type: String,
            required: true,
            minLength: 4,
            trim: true
        },
        level: {
            type: Number,
            min: 1,
            max: 5,
            trim: true,
            required:true
        },
        isActive:{
            type: Boolean,
            required: true
        }
    }, {
        timestamps: true,
        strict: false
    }
)

export default model("Faqs", faqsSchema)
