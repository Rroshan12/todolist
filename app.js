const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
mongoose.connect('mongodb://localhost:27017/todosdb', {useNewUrlParser: true, useUnifiedTopology: true});


const app = express();


const itemSchema = new mongoose.Schema({
    name: String
   


});

const Item = mongoose.model("Item", itemSchema);


const item1 = new Item({
    name: "Apple"
});
const item2 = new Item({
    name: "banana"
});
const item3 = new Item({
    name: "mango"

});
const defaultitems = [item1,item2,item3];




//var items = ["Brush teeth", "Bath", "Sex"];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req,res){

let today = new Date();
let options = {
    weekday:"long",
    day:"numeric",
    month:"long"
};


let day = today.toLocaleDateString("en-Us", options)

Item.find(
function(err,founditems){
    
    
    if(founditems.length===0){
        Item.insertMany(defaultitems, function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("success");
    }
    
});
        res.redirect('/');
    }
    else{
        res.render("list", {nameofDay :day, numofItems : founditems});
        
    }
  
           
            
        });
    
    
   

});

app.post("/",function(request,responce){
    var itemName = request.body.newItem;
    const item = new Item({
    name: itemName
});
    item.save();
    responce.redirect('/');
});


app.post("/delete", function(req,res){
    var checkedItems = req.body.button;
          
    Item.findByIdAndRemove(checkedItems, function(err, items) {
    if (err) {
      console.log(err);
    } else {
      console.log(items);
        res.redirect("/");
    }
  });  
    
  
    
});
   



app.listen(3000, function(){
    console.log("server started");
})
