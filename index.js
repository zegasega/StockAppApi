const express = require('express')
const app = express()
const mongoose = require('mongoose')
app.use(express.json());
const User = require('./models/register.js'); 
const bcrypt = require('bcrypt');


app.get('/', (req,res) => {

    res.send('hello from node api sa beyler');
});



app.post('/register', async (req,res)=> {

    try {

        const user = await User.create(req.body);
        res.status(200).json({message:"User Succesfully registered",user:user});

        const savedUser = await user.save();
        console.log(savedUser);
        
    } catch (error) {

        res.status(500).json({message: error.message});
        
    }
    


});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kullanıcıyı veritabanında bulun
        const user = await User.findOne({ username });

        // Kullanıcı bulunamadıysa hata döndür
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Parolayı karşılaştır ve doğrula
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Giriş başarılı, giriş yapan kullanıcıyı yanıt olarak gönder
        res.status(200).json({ message: 'Login successful', user:user });
    } catch (error) {
        // Hata durumunda uygun bir hata mesajı döndür
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


mongoose.connect("mongodb://localhost:27017/users")
.then(()=> {
    console.log("Connected to Database");
    app.listen(3000, ()=>{

        console.log('Server Listening on port 3000');
    
    });
})
.catch(() => {
    console.log("connection failed");
})
