const express = require('express')
const { findOne } = require('../models/person')
const route = express.Router()
// requiring Schema
const person=require('../models/person')

 





//creating a single or many user (table of object))
route.post('/', async(req, res)=>{ 
    const newperson=req.body 
  /* 
  the request should be like the object below or a table of object like the object below
  {
      "name":"ibrahim",
      "age":31,
      "email":"ibrahimmstahli@gmail.com",
      "favouriteFoods":["bab","lool"]
  }
  */
    try {
      const returned=await person.create(newperson); 
      res.status(201).json(returned) 
    }
    catch(err){
      res.status(400).json({error:err.message})

    }
    
}) 
//creating document with save and callback function
route.post('/withcallback', async(req, res)=>{ 
    const newperson=new person({name:req.body.name,
      age:req.body.age,
      email:req.body.email,
      favouriteFoods:req.body.favouriteFoods


    }) 
      try {
        await newperson.save((err,data)=>{
          res.status(201).json(data) 
        console.log(err)
        } 
        );  
        //function(err,data){console.log(data)}
       
      }
      catch(err){
        res.status(400).json({error:err.message})
  
      }
      
  })
  /*
 Create Many Records with model.create()
the request body should look be a table of object or an object 
the body should be in jason and look a something like below
 [{
    "name":"ibrahim",
    "age":31,
    "email":"ibrahimmsahli1@gmail.com",
    "favouriteFoods":["bab","lool"]
},

{
    "name":"ibrahim",
    "age":31,
    "email":"ibrahimmsssdahli3@gmail.com",
    "favouriteFoods":["bab","lool"]
}] */

  route.post('/many', async(req, res)=>{ 

    const allnewperson= req.body 

      try {
        const returned=await person.create(allnewperson); 
        res.status(201).json(returned) 
      }
      catch(err){
        res.status(400).json({error:err.message})
  
      }
      
  }) 




//getting all person

 route.get('/', async(req, res)=>{ 
  try{
    const all= await person.find(); 
    res.json(all)
}
catch(err){
res.status(500).json({error :err.message});
}
})   

  //getting all people with a spesific name 
  route.get('/:name', async(req, res)=>{ 
    try{
      const all= await person.find({name:req.params.name}); 
      if (all!=null)
     { console.log(all)
      res.json(all)}
      else
      res.status(400).json({message :"person not found"});

  }
  catch(err){
  res.status(500).json({error :err.message});
  }
  })  
/* find one by his favourite food the request should be like  
http://localhost:6000/person/favouriteFoods/["chocolat","pizza"]*/
  route.get('/favouriteFoods/:favouriteFoods', async(req, res)=>{ 
    try{
      let search=req.params.favouriteFoods
      .substr(1,req.params.favouriteFoods.length-2)
      .split(",")
      .map(elm=>elm.substr(1,elm.length-2))
          const one= await person.findOne({favouriteFoods:search});
      if (one!=null)
     { 
      res.json(one)}
      else
      res.status(400).json({message :"person not found"});
     }
  catch(err){ 
  res.status(500).json({error :err.message});
     }
     })   

   //the request should look like http://localhost:6000/person/get/favoriteFood/pizza
  route.get("/get/favoriteFood/:food", (req, res) => {
    const food = req.params.food; // find by favoritesFood
    person.findOne({favouriteFoods: {$in :food}}) 
      .then((doc) => res.send(doc))
      .catch((err) => res.status(401).json(err.message)); 
  });



//a midleware that can be used instead of repeting code
  async function middelware(req,res,next){
    let returned
    try {  returned= await person.findById(req.params.id)
      console.log("req.params.id",req.params.id);
      if(returned===null)
    { return res.status(404).json({message:"cannot find person"})}
  
      
    } catch (error) {
      res.status(500).json({error :err.message});

    }
  res.returned=returned
  console.log("middleware turn on")
 
  next();
  }
  // get  by id 
  route.get('/getbyid/:id', middelware,async(req, res)=>{
    console.log("the id is",res.returned._id)
    res.json(res.returned)  
  })
 
  
  
  //you can patch it and change the attribut
  route.patch('/:id', middelware,async (req, res)=>{
if (req.body.name!=null)
res.returned.name=req.body.name
if(req.body.favouriteFoods!=null)
res.returned.favouriteFoods=req.body.favouriteFoods
if(req.body.age!=null)
res.returned.age=req.body.age
if(req.body.email!=null)
res.returned.email=req.body.email
try {
   const s=await res.returned.save()  
  console.log(res.returned)
  const updatedperson= await person.findById(res.returned._id) 
  
  res.status(201).json(updatedperson)
} catch (error) {
  res.status(500).json({message:error}) 
}

  })
//  Perform Classic Updates by Running Find, Edit, then Save
//http://localhost:6000/person/favouritefood/60ff5e6346cde62e8c91062d/hamberger
  route.patch('/favouritefood/:id/:food', middelware,async (req, res)=>{

    res.returned.favouriteFoods.push(req.params.food) 
    //or     res.returned.favouriteFoods.push("hamberger") 

    
    try {
       const s=await res.returned.save()  
      console.log(res.returned)
      const updatedperson= await person.findById(res.returned._id) 
      
      res.status(201).json(updatedperson)
    } catch (error) {
      res.status(500).json({message:error}) 
    }
    
      })

//or
route.patch("/addfood/:id",middelware, (req, res) => {
  const foodToAdd = "hamburger";
  
  person.findOne({ _id:res.returned._id }, (err, data) => {
    console.log(err)
    data.favouriteFoods.push(foodToAdd);
    data
      .save()
      .then((doc) => res.json(doc))
      .catch((err) => res.status(401).json({ error: err.message }));
  });
});  
//findbyhis id and update
route.patch("/findbyidandupdate/:id", middelware,(req, res) => {
  const givenAge = req.body.age;
  //find by name and update age and conserve the others infos
  person.findByIdAndUpdate(res.returned._id,{age:givenAge},{new:true}).then((docs)=>{

   res.json(docs)})
    .catch((err) => res.status(401).json(err.message));
});
//find one  by filter and update
route.patch("/findoneandupdate/:name",(req, res) => {
  const givenAge = req.body.age;
  //find by name and update age and conserve the others infos
  person.findOneAndUpdate({name:req.params.name},{age:givenAge},{new:true}).then((docs)=>{

   res.json(docs)})
    .catch((err) => res.status(401).json(err.message));
});



//find a person by his id and delete it 

route.delete("/deleteperson/:id", (req, res) => {
  person.findByIdAndDelete(req.params.id)
    .then(() => res.json("user deleted"))
    .catch((err) => res.status(401).json(err.message));
});

//deletemanyusers
route.delete("/deletemanyusers", (req, res) => {
  person.remove({name:"mary"})
    .then(() => res.send("user deleted"))
    .catch((err) => res.status(401).json(err.message));
});



//Chain Search Query Helpers to Narrow Search Results

    route.get("/users/favoriteFoods/burritos", (req, res) => {
    
    person.find({favouriteFoods: {$in :"burritos"}})
      // find by favoriteFood
        .limit(2) // limit to 2 items
        .sort({ name: 1 }) // sort ascending by name
        .select("-age") // hide their age
        .exec() // execute the query
        .then((doc) => res.send(doc))
        .catch((err) => res.status(401).json(err.message));
    });

    
      



  
    
 


 


 
  module.exports =route
    
