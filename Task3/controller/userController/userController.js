const User = require('../../model/userModel/userModel');
const { hashPassword, comparePassword } = require('../../utils/encrypt');
const { generateToken } = require('../../utils/jwt');



// Create  user
module.exports.createUser = async (req, res) => {
    try {
        const { name, email, password, phone_no, address,gender,company_name } = req.body;
 
        const hashedPassword = await hashPassword(password);
        if (!hashedPassword) {
            return res.status(500).json({ message: "Password hashing failed!" });
        }
        const user = new User({ name, email, password:hashedPassword, phone_no, address,gender,company_name });
        await user.save();
        
        return res.status(201).json({ message: "User created successfully!", user });

    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "create user error!" });
    }
}

//Update user
module.exports.updateUser = async (req,res) => {
    try{
        const {id} = req.query;
        const { name, email, password, phone_no, address,gender,company_name  } = req.body;

        const hashedPassword = await hashPassword(password);
        if (!hashedPassword) {
            return res.status(500).json({ message: "Password hashing failed!" });
        }

        const updateUser = await User.findByIdAndUpdate(id, {name, email, password:hashedPassword, phone_no, address,gender,company_name }, { new: true });
        if (!updateUser) {
            return res.status(404).json({ message: "User not found!" });
        }
        return res.status(200).json({ 
            message: "User updated successfully!" ,
            user: updateUser
    });

        
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: "update user error!" });
    }
}

//Delete user(Soft Delete)
module.exports.softDeleteUser = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await User.findByIdAndUpdate(id, { is_deleted: true }, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User soft deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//permnet delete 
module.exports.permanentDeleteUser = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User permanently deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


//list user
module.exports.listUsers = async (req,res) => {
    try{
        let{page=1, limit=10} = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const users = await User.find({ is_deleted: false })
            .skip((page - 1) * limit)
            .limit(limit);  

            const total = await User.countDocuments({ is_deleted: false });
            return res.json({
                page,
                limit,
                total,
                users
            });

    }catch(error){
        console.error(error);
        return res.status(500).json({ message: "list user error!" });
    }
}   



//get user by id
module.exports.getUserById = async (req,res) => {
    try{
        const {id} = req.query;
        const user = await User.findById(id)

    return res.status(200).json({ 
        message: "User fetched successfully!",
        user 
    });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "get user by id error!" });
    }
}


//search users
module.exports.searchUsers = async (req,res) => {
    try{
        let {search,page=1, limit=10} = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const query = {
            is_deleted: false,
            $or: [
                {
                    name: { $regex: search, $options: 'i' }
                },
                {
                    email: { $regex: search, $options: 'i' }
                }
            ]
        };
        const users = await User.find(query)
            .skip((page - 1) * limit)
            .limit(limit);  
            const total = await User.countDocuments(query);
            return res.json({
                page,
                limit,
                total,
                users   
                }
            );

    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "search user error!" });
    }
}


//login user
module.exports.loginUser = async (req,res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email,is_deleted:false});
        if(!user){
            return res.status(400).json({message: "Invalid email or password!"});
        }       
        const isMatch = await comparePassword(password,user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password!"});
        }   
       
        const token = generateToken(user._id);

        return res.status(200).json({message: "Login successful!", token,user});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "login user error!" });
    }       
}
