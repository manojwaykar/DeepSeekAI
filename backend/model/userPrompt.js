import mongoose from "mongoose";

const promptSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    messages : [
        {
            role:{
                type:String,
                enum:["user", "assistant"],
                required:false
            },
            content:{
                type:String,
                required:false
            },
            timestamp:{
                type:Number,
                required:false
            }
        }
    ],
    userId:{
        type:String,
        required:true
    },
    
}, {timestamps: true});

export const Prompt = mongoose.model("Prompt" , promptSchema);