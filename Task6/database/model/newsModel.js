import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    
    title: { 
        type: String, 
        required: true 
    },
    description: {
         type: String, 
         required: true 
        },
    category: {
         type: String
         },   
         likes: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            }
          ],
          likesCount:{
            type:Number,
            default:0,
          },
          commentCount:{
            type:Number,
            default:0,
          }
   
},
{timestamps:true}

);

const newsModel = mongoose.model("News", newsSchema);
export default newsModel;


// import mongoose from "mongoose";
// import { type } from "os";

// const newsSchema = new mongoose.Schema(
//   {
    

//     // Main content
//     title: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     content: {
//       type: String,
//       required: true
//     },
//     images: [
//       {
//         name: { type: String, required: true }
//       }
//     ],
//     videos: [
//       {
//         name: { type: String, required: true }
//       }
//     ],


//     likes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//       }
//     ],
//     likesCount:{
//       type:Number,
//       default:0,
//     },
//     commentCount:{
//       type:Number,
//       default:0,
//     }
//   },
//   { timestamps: true }
// );

// const News = mongoose.model("News", newsSchema);
// export default News;
