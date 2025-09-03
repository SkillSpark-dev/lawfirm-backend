const dotenv= require('dotenv');
dotenv.config({quiet: true});
const mongoose = require('mongoose');


const app = require('./app');
const port = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log('Database connection successful');
        app.listen(port,()=>{
            console.log(`Server running on port ${port}`)
        });
    })
    .catch((error)=>{
        console.log(error);
    })
