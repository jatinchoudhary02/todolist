const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://jatin:30111973@cluster0.v1ii1.mongodb.net/todolistDB?retryWrites=true" ,{ useUnifiedTopology: true ,useNewUrlParser: true});
app.use(bodyparser.urlencoded({
  extended: true
}));
app.set('view engine', "ejs");
app.use(express.static("public"));

const ItemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", ItemSchema);

const item1=new Item({
  name:"Welcome"
});
const item2=new Item({
  name:"Hit + button to add"
});
const item3=new Item({
  name:"<--Hit this to delete"
});
const defaultitems =[item1,item2,item3];
const listSchema=new mongoose.Schema({
  name:String,
  items:[ItemSchema]
});
const List=mongoose.model("List",listSchema);


app.get("/", function(req, res) {

  Item.find({},function(err,founditems){
    if(founditems.length==0)
    {
      Item.insertMany(defaultitems,function(err){
        if(err)
           console.log(err);
         else
        console.log("ll");
      });

    }
    res.render("list", {
      vaar: "Today",
      newlist: founditems
    });
  })


});
app.post("/", function(req, res) {
  var k = req.body.todo;
const item4=new Item({
  name:k
});
const z=req.body.btn;
if(z=="Today")
{
  item4.save();
  res.redirect("/");
}
else{
List.findOne({name:z},function(err,foundList){
    foundList.items.push(item4);
    foundList.save();
    res.redirect("/"+z);
  });
}



});
app.post("/delete",function(req,res){
  var k=req.body.deleteitem;
  const topic=req.body.topic;
  if(topic=="Today"){
  Item.deleteOne({name:k},function(err){
    if(err)
    console.log(err);
    else
    console.log("delete");
  });
  res.redirect("/");
}
else{
  List.findOneAndUpdate(
    {name:topic},
    {$pull:{items:{name:k}}},
    function(err,foundList){
      if(!err)
      res.redirect("/"+topic);
    }
  );

}
});

app.get("/:title",function(req,res){
  var q=req.params.title;
  List.findOne({name:q},function(err,foundList){
    if(!foundList)
    {
      const list=new List({
        name:q,
        items:defaultitems
      });
      list.save();
      res.redirect("/"+q);

    }
    else{
      res.render("list",{vaar:q,newlist:foundList.items});
    }
  });

});




app.listen(process.env.PORT||214,function(){
  console.log("bhaichara");
});
