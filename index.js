const express = require('express')

const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rdsgc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection('orders');

  app.post('/addProducts',(req,res)=>{
    collection.insertMany(req.body)
    .then(result=>{
        console.log('product add done');
    })
  })
  app.post('/orderItems',(req,res)=>{
    orderCollection.insertOne(req.body)
    .then(result=>{
        res.send(result.insertedCount > 0);
    })
  })

  app.get('/getProductInfo',(req,res)=>{
      collection.find({})
      .toArray((err,result)=>{
          res.send(result)
      })
  })

  app.get('/product/:key',(req,res)=>{
      collection.find({key: req.params.key})
      .toArray((err,result)=>{
          res.send(result[0])
      })
  })

  app.post('/review',(req,res)=>{
     collection.find({key:{$in:req.body}})
      .toArray((err,result)=>{
        setTimeout(() => {
          res.send(result);
        }, 1000);
          
      })
  })
});
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
app.listen(process.env.PORT || port)