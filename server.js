const express=require('express')
const app=express()
const bodyParser=require('body-parser') //Information will be passed from client to server in the form of bodyParser.bodyParser is middleware between client and server.
const MongoClient=require('mongodb').MongoClient;

var db;
var s;

//Establishing connection between Database and 
MongoClient.connect('mongodb://localhost:27017/audiowave',(err,database)=> //=> is known as arrow function. It is same as a function.
{
    if(err)
        return console.log(err)
    db=database.db('audiowave')
    app.listen(3201, ()=>
    {
        console.log('Listening at port number 3201')
    })
})

app.set('view engine','ejs') //View engine of server(webpage) is ejs.
app.use(bodyParser.urlencoded({extended:true})) //Data is obtained from bodyParser module.
app.use(bodyParser.json()) // Data is obtained from client in the form of json objects.
app.use(express.static('public')) //public folder is made available to server. Static files are present in public folder.

app.get('/',(req,res)=> //parameters-url,callback function.
{
    db.collection('headphoneInventory').find().toArray((err,result)=>
    {
        if(err) return console.log(err)
    res.render('homepage.ejs',{data:result}) //load the homepage
    })
})

app.get('/create',(req,res)=> //Adding a product
{
    res.render('add.ejs') 
})

app.get('/updateStock',(req,res)=>
{
    res.render('update.ejs')
})

app.get('/deleteProduct',(req,res)=>
{
    res.render('delete.ejs')
})

app.post('/AddData',(req,res)=>
{
    db.collection('headphoneInventory').save(req.body,(err,result)=>
    {
        if(err) return console.log(err)
    res.redirect('/')
    })
})
app.post('/update',(req,res)=>
{
    /*
    db.collection('headphoneInventory').findOneAndUpdate({'Product_ID' :req.body.id},{
        $set:{'Stock':req.body.Stock}},{sort:{Product_ID:-1}},
        (err,result)=>{
          if(err)
            return res.send(err)
          console.log(req.body.id+' got updated')
          res.redirect('/')
        */
    db.collection('headphoneInventory').find().toArray((err,result)=>
    {
        
        if(err) return console.log(err)
        console.log(result)
        for(var i=0;i<result.length;i++)
        {
            if(result[i].Product_ID==req.body.id)
            {
                s=result[i].Stock
                break
            }
        }
        console.log(result[i].Stock)
        db.collection('headphoneInventory').findOneAndUpdate(
        {Product_ID:req.body.id},
        {$set:{Stock:(parseInt(s)+parseInt(req.body.Stock)).toString()}},
        {sort:{_id:-1}},(err,result)=>
        {
            if(err) return res.send(err)
            console.log(req.body.id+' Stock Updated.')
            res.redirect('/')
    })
    })

app.post('/delete',(req,res)=>
{
    db.collection('headphoneInventory').findOneAndDelete(
        {Product_ID:req.body.id},(err,result)=>
        {
            if(err) return console.log(err)
            res.redirect('/')
        })
})
})