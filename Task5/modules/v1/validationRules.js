const checkValidationRules = {

    signupValidation: {
        username: "required|string",
        email: "required|email", 
        mobileNo: "required|string",
        role:"required|string"
    },
    resetPasswordValidation: {
        token: 'required|string',
        newPassword: 'required|string|min:6'
    }
}

export default checkValidationRules;