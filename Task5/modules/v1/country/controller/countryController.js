import countryModules from "../modules/countryModules.js";

const getCountries = (req, res) => {
  try {
    countryModules.getCountries(req, res);
  } catch (error) {
    console.error("get country error!", error.message);
  }
};

export default { getCountries };
