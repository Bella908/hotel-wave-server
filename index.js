const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

// const corsOptions ={
//     origin:{'http://localhost:5173':'http://localhost:5173'},
//     Credentials : true,
//     optionSuccessStatus : 200,
    
// }

app.use (cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ld1lprp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      
      // Send a ping to confirm a successful connection





      app.get('/countries', async (req, res) => {
        const cursor = countryCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
     
    }
  }
  run().catch(console.dir);

app.get('/', (req,res) =>{
    res.send('hellow from server')
})
app.listen(port,() =>console.log(`Server running on port ${port}`))