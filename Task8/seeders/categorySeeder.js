// seeders/categoryBrandSeeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../database/models/categotyModel.js";
import Brand from "../database/models/brandModel.js";
import Product from "../database/models/productModel.js";

dotenv.config();

mongoose.connect("mongodb://localhost:27017/hyperlinkTask8", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});




const seedData = async () => {
  try {
    await Category.deleteMany();
    await Brand.deleteMany();
    await Product.deleteMany();

    const categories = await Category.insertMany([
      { name: "Fruits", imageUrl: "fruits.png" },
      { name: "Vegetables", imageUrl: "vegetables.png" },
      { name: "Beverages", imageUrl: "beverages.png" },
    ]);

    const brands = await Brand.insertMany([
      { name: "Amul", logoUrl: "amul.png" },
      { name: "Nestle", logoUrl: "nestle.png" },
      { name: "Pepsi", logoUrl: "pepsi.png" },
    ]);

    const products = await Product.insertMany([
      {
        name: "Apple",
        price: 120,
        description: "Fresh Apples",
        imageUrl: "apple.png",
        category: categories[0]._id, // Fruits
        brand: brands[1]._id,       // Nestle
      },
      {
        name: "Tomato",
        price: 40,
        description: "Fresh Tomatoes",
        imageUrl: "tomato.png",
        category: categories[1]._id, // Vegetables
        brand: brands[0]._id,        // Amul
      },
      {
        name: "Coke",
        price: 60,
        description: "Cold Drink",
        imageUrl: "coke.png",
        category: categories[2]._id, // Beverages
        brand: brands[2]._id,        // Pepsi
      },
    ]);

    console.log("Seeding done ✅");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
