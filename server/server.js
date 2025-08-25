import {app} from './app.js'
import 'dotenv/config'
import connectDB from "./db/index.js";


const PORT = process.env.PORT||4000
app.get('/',(req,res)=>{
    res.send('Kya be')
})

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

