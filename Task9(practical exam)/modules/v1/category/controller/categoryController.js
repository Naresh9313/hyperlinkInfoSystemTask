import categoryModule from "../module/categoryModule.js";

const getAllCategories = (req, res) => {
  try {
    categoryModule.getAllCategories(req, res);
  } catch (error) {
    console.error("getAllCategories error!", error.message);
  }
};



const getAllDoctors = (req, res) => {
  try {
    categoryModule.getAllDoctors(req, res);
  } catch (error) {
    console.error("getAllDoctors error!", error.message);
  }
};


const getDoctorDetails = (req, res) => {
  try {
    categoryModule.getDoctorDetails(req, res);
  } catch (error) {
    console.error("getAllDoctors error!", error.message);
  }
};





export default {getAllCategories,getAllDoctors,getDoctorDetails}