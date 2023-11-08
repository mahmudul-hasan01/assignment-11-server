const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
const jwt =require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000
require('dotenv').config()

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials:true,
}))
app.use(express.json())
app.use(cookieParser())

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

    const varify =(req,res,next)=>{
      const token =req.cookies?.token
      if(!token){
        return res.status(401).send({massage: 'unauthorized access'})
      }
      jwt.verify(token,process.env.TOKEN,(err,decoded)=>{
        if(err){
          return res.status(401).send({massage: 'unauthorized access'})
        }
        req.user = decoded
        next()
      })
    }


    app.post('/jwt',async(req,res)=>{
      const user =req.body
      const token =jwt.sign(user,process.env.TOKEN,{expiresIn: '1h'})
      res.cookie('token',token,{
        httpOnly: true,
        secure:true,
        sameSite: 'none'
      })
      .send({success:true})
    })
    app.post('/logout',async(req,res)=>{
      const body =req.body
      res.clearCookie('token',{maxAge:0}).send({success:true})
    })

    app.get('/service',varify, async (req, res) => {
      // console.log(req.cookies)
      const result = await serviceDatails.find().toArray()
      res.send(result)
    })
    
    app.post('/allService', async(req,res)=>{
      try {
        const body = req.body
        const result = await allService.insertOne(body)
        res.send(result)
      }catch(error){
        console.log(error)
      }
    })
    app.get('/allService',varify, async (req, res) => {
      // console.log(req.query.value)
      // let query = {}
      // console.log(query)
      // if (req.query.value) {
      //   query = { serviceName: req.query.serviceName}
      // }
      const result = await allService.find().toArray()
      res.send(result)
    })
   
    app.get('/allService/:id',varify, async (req, res) => {
      // console.log(req.cookies)
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await allService.findOne(query)
      res.send(result)
    })

    app.get('/PurchaseData',varify, async(req,res) => {
      // console.log(req.cookies)
      // if(req?.user?.email !== req?.query?.email){
      //   return res.status(403).send({massage: 'unauthorized access'})
      // }
      let query = {}
      if (req?.query?.email) {
        query = { email: req?.query?.email}
      }
      const result = await PurchaseInfo.find(query).toArray()
      res.send(result)
    })
    app.get('/PurchaseData/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await PurchaseInfo.findOne(query)
      res.send(result)
    })
    app.post('/Purchase', async (req, res) => {
      try {
        const body = req.body
        const result = await PurchaseInfo.insertOne(body)
        res.send(result)
      }catch(error){
        console.log(error)
      }
    })
    app.delete('/PurchaseData/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await PurchaseInfo.deleteOne(query)
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