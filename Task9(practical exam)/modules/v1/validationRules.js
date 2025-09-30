const validaterules = {
  signupValidation: {
    fullName: "required|string|regex:/^[A-Za-z ]+$/|min:3|max:50",
    mobileNumber: "required|digits:10",
    email: "required|email",
    password: "required|string|min:6|max:20",
  },
  loginValidation: {
    email: "required|email",
    password: "required|string|min:6|max:20",
  },
  favouriteValidation: {
    doctorId: "required|string",
  },
};

export default validaterules;
