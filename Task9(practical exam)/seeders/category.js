import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../database/models/categoryModel.js";
import Doctor from "../database/models/doctorModel.js";

dotenv.config();

mongoose.connect("mongodb://localhost:27017/PracticalTask", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", async () => {
  console.log("Connected to MongoDB");

  try {
    const categoriesData = ["Cardiology", "Neurology", "Dentist"];
    const categories = [];
    for (let name of categoriesData) {
      let category = await Category.findOne({ name });
      if (!category) category = await Category.create({ name });
      categories.push(category);
    }

    await Doctor.deleteMany({});

    const doctorsData = [
      { name: "Dr. John Doe", categoryName: "Cardiology", email: "john@example.com", mobileNumber: "9876543210", experience: "10 years", fees: 500, image: "url" },
      { name: "Dr. Alice Smith", categoryName: "Neurology", email: "alice@example.com", mobileNumber: "9871143211", experience: "8 years", fees: 600, image: "url" },
      { name: "Dr. Naresh Prajapati", categoryName: "Dentist", email: "naresh@example.com", mobileNumber: "9276543211", experience: "8 years", fees: 1000, image: "url" },
      { name: "Dr. Jatin Prajapati", categoryName: "Cardiology", email: "jatin@example.com", mobileNumber: "9376543211", experience: "8 years", fees: 1000, image: "url" },
      { name: "Dr. Bhavin Motka", categoryName: "Neurology", email: "bhavin@example.com", mobileNumber: "8876543211", experience: "8 years", fees: 1000, image: "url" },
      { name: "Dr. Sallu", categoryName: "Neurology", email: "Sallu@example.com", mobileNumber: "9806543211", experience: "8 years", fees: 1000, image: "url" },
      { name: "Dr. Dhara", categoryName: "Cardiology", email: "dhara@example.com", mobileNumber: "9876543211", experience: "8 years", fees: 1000, image: "url" },
      { name: "Dr. Daksh Mehta", categoryName: "Neurology", email: "Daksh@example.com", mobileNumber: "9176543211", experience: "8 years", fees: 1000, image: "url" },
      { name: "Dr. Yash Gupta", categoryName: "Dentist", email: "Yash@example.com", mobileNumber: "9826543211", experience: "8 years", fees: 1000, image: "url" },
      { name: "Dr. happy Mehta", categoryName: "Neurology", email: "happy@example.com", mobileNumber: "9176543211", experience: "8 years", fees: 1000, image: "url" },
      { name: "Dr. yash Mehta", categoryName: "Neurology", email: "yash11@example.com", mobileNumber: "9976543211", experience: "8 years", fees: 1000, image: "url" },
    ];

    for (let doc of doctorsData) {
      const category = categories.find(c => c.name === doc.categoryName);
      await Doctor.create({ ...doc, category: category._id });
      console.log(`${doc.name} added`);
    }

    console.log("Seeding completed!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
