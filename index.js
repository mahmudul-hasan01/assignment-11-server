const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uoehazd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const serviceDatails = client.db("ServiceDB").collection("Service");
    const allService = client.db("All_ServiceDB").collection("All_Service");
    const PurchaseInfo = client.db("PurchaseDB").collection("Purchase_Info");

    app.get('/service', async (req, res) => {
      const result = await serviceDatails.find().toArray()
      res.send(result)
    })

    app.get('/allService', async (req, res) => {
      // console.log('name', req.query.serviceName)
      // let query = {}
      // console.log(query)
      // if (req.query.email) {
      //   query = { name: req.query.serviceName}
      // }
      const result = await allService.find().toArray()
      res.send(result)
    })
    app.get('/allService/:id', async (req, res) => {
      const id = req.params.id
      console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await allService.findOne(query)
      res.send(result)
    })
   
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})