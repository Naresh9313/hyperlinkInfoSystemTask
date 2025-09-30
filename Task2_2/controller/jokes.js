

let jokes = [
  "Why don’t scientists trust atoms? Because they make up everything!",
  "Why did the computer go to the doctor? Because it caught a virus!",
  "Why do Java developers wear glasses? Because they don’t C#!",
  "Why was the math book sad? Because it had too many problems.",
  "I would tell you a UDP joke, but you might not get it."
];

module.exports.addJoke = async (req, res) => {
    try{
    const { joke } = req.body;
    if (!joke) {
        return res.status(400).json({ message: "Please provide a joke text!" });    
    }
    jokes.push(joke);
    res.json({ message: "Joke added successfully!", jokes });       

    }catch(error){
        res.status(500).json({message: "Internal Server Error"});
    }   
};




module.exports.getJokes = async (req, res) => {
    try{
        res.json({ jokes });
    }catch(error){  
        res.status(500).json({message: "Internal Server Error"});
    }       
}


module.exports.getRandomJoke =  async (req, res) => {
    try{
        const randomIndex = Math.floor(Math.random() * jokes.length);       
        res.json({ joke: jokes[randomIndex] });
    }       
    catch(error){
        res.status(500).json({message: "Internal Server Error"});
    }       
}

