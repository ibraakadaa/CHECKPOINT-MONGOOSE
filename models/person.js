const mongoose=require('mongoose')
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};// validator function
const person =new mongoose.Schema({

    name :{
    type:String,
    required : true,
          },
          email: {
            type: String,
            trim: true,
            lowercase: true,
            unique :true,
            
            required: true,
            validate: [validateEmail, 'Please fill a valid email address'], 
            },
            age :{
            type : Number, 
            required:true
              },
              favouriteFoods:{
            type:[String],
              default : ["potato","Banana"]
            
                           }


                        
    
})  

module.exports = mongoose.model("person", person); 

 