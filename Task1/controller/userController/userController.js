const User = require('../../models/userModel/userModel');


module.exports.addUser = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const newUser = new User({ name, email, age });
        await newUser.save();
       return  res.status(201).json({
            message: 'User added successfully',
            data:newUser
       });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }       
};


module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};  


module.exports.updateUser = async (req, res) => {
    try{
        const { id } = req.query;
        const { name, email, age } = req.body;

        const updateUser  = await User.findByIdAndUpdate(
            id,{name, email, age},{ new: true }
        );
    return res.status(200).json({
            message: 'User updated successfully',
             user: updateUser
        }); 
    }catch(error){
        console.error('Error updating user:', error);
        return res.status(500).json({
             message: error.message });
    }
};


module.exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.query;
        const deletedUser = await User.findByIdAndDelete(id);   
        if (!deletedUser) { 
            return res.status(404).json({ message: 'User not found' });
        }
      return  res.status(200).json({ 
        message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: error.message });
    }       
};
