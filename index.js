const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());
const { MongoClient,ObjectId} = require('mongodb');

const client = new MongoClient(
   'mongodb+srv://sailakshmiyyy:qH8z7c9FkOimu0QF@cluster0.mz8v4ou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  );

  client.connect().then(() => console.log("Connected Successfully"))
  .catch((error) => console.log("Failed to connect", error));

  const db = client.db("Department");
  const collection = db.collection('department');

  app.get('/',async(req,res) => {
    res.send('App is running')
  })

  app.get('/getList',async(req,res) => {
    try {
        const result = await collection.find().toArray();
        // console.log('result',result)
        res.status(200).json(result)
        
    } catch (error) {
        console.error(`ERROR: ${error}`);
        res.status(500).json({error:"An Error occured while fetching Data"});
        
    }
  })

  app.post('/create', async(req,res) => {
    // const { deptName } = req.body;
    // console.log("req",req.body)
    // const newData = {
    //     deptName:req.body,
    // }
    // console.log('newData',newData)
    try {
        const result = await collection.insertOne(req.body);
        res.json({success:true,message:"Name Added Successfully"});
        
    } catch (error) {
        console.error(`Error:${error}`);
        res.status(500).json({success: false,message:"Failed to Insert"})        
    }
  })

  app.put('/editDept/:id',async(req,res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const result =await collection.updateOne({_id:new ObjectId(id)},{$set:data});
        console.log('result',result);
        if (result.modifiedCount > 0) {
            res.json({ success: true, message: "Updated Successfully" });
          } else {
            res.status(404).json({ success: false, message: "Not Updated" });
          }
        
    } catch (error) {
        console.error("Error",error);
        res.status(500).json({success:true,message:"Failed to Update"})
    }
  })

  app.delete('/deleteDept/:id',async(req,res) => {
    const id = req.params.id;
    try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        res.json({success:true,message:"Deleted Successfully"})
        
    } catch (error) {
        console.error("Error deleting",error);
        res.status(500).json({success:false,message:"Server Error"})        
    }
  })


  app.listen('4000',() => {
    console.log('App is running on port 4000')
  })