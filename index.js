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

app.use(cors());
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

    const roomsCollection = client.db('hotelWave').collection('rooms');
    const bookingCollection = client.db('hotelWave').collection('booking');
    const reviewCollection = client.db('hotelWave').collection('review');
    const featureCollection = client.db('hotelWave').collection('featureRoom');



    app.get('/rooms', async (req, res) => {
      const cursor = roomsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/feature', async (req, res) => {
      const cursor = featureCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.post('/booking', async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);
      res.send(result);
    })


    app.patch('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const { status } = req.body; // Extract only the status from the request body
      const query = { _id: new ObjectId(id) };
  
      const updateDoc = {
          $set: {
              status: status // Update only the 'status' field
          }
      };
  
      try {
          const result = await roomsCollection.updateOne(query, updateDoc);
          res.send(result);
      } catch (error) {
          console.error("Error occurred during update:", error);
          res.status(500).json({ error: "An error occurred during update" });
      }
  });
    
    // feature
  
  app.patch('/feature-room/:id', async (req, res) => {
      const id = req.params.id;
      const { status } = req.body; // Extract only the status from the request body
      const query = { _id: new ObjectId(id) };
  
      const updateDoc = {
          $set: {
              status: status // Update only the 'status' field
          }
      };
  
      try {
          const result = await featureCollection.updateOne(query, updateDoc);
          res.send(result);
      } catch (error) {
          console.error("Error occurred during update:", error);
          res.status(500).json({ error: "An error occurred during update" });
      }
  });
    
  
  
  



    app.post('/review', async (req, res) => {
      const bookingData = req.body;
      const result = await reviewCollection.insertOne(bookingData);
      res.send(result);
    })

    app.get('/review', async (req, res) => {
      console.log(req.query.roomId);
      let query = {};
      if (req.query?.roomId) {
        query = { roomId: req.query.roomId }
      }
      const result = await reviewCollection.find().toArray();
      res.send(result);
    })



    // Assuming you have an Express.js route handler for handling review submissions






    app.get('/rooms/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }

      const result = await roomsCollection.findOne(query);
      res.send(result);
    })


    app.get('/myBooking', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await bookingCollection.find().toArray();
      res.send(result);
    })


    app.delete("/myBooking/delete/:_id", async (req, res) => {
      const result = await bookingCollection.deleteOne({ _id: new ObjectId(req.params._id) });

      res.send(result)
    })





    app.put("/myBooking/update/:_id", async (req, res) => {
      const id = req.params._id;
      const filter = { _id: new ObjectId(id) };
      const updatedFields = { $set: { deadline: req.body.deadline } }; // Only update the deadline field
      try {
        const result = await bookingCollection.updateOne(filter, updatedFields);
        res.send(result);
      } catch (error) {
        console.error("Error occurred during update:", error);
        res.status(500).json({ error: "An error occurred during update" });
      }
    });




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('hellow from server')
})
app.listen(port, () => console.log(`Server running on port ${port}`))