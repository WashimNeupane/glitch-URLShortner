'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var cors = require('cors');
var app = express();
const dns = require('dns');
const bodyParser = require('body-parser')

let id = 0;
const lists = [];
// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//Get the shortened url replacing dns wiht id
app.post("/api/shorturl/new",(req,res)=>{
  //remove the protocol before dns lookup
  const { url } = req.body;
  const newurl = url.replace(/^https?:\/\//i,'');
  
  //check if dns exists  
  dns.lookup(newurl,(err)=>{
    //if invalid dns, return string
    if(err) return res.json({error:"INVALID URL"});
    //ELSE     
    //define a return class consisting the following properties    
    //return the shortened url
    id++;
    const returnClass = {
      original_url:url,
      short_url:`${id}` 
    };
    
    lists.push(returnClass);
    return res.json(returnClass);    
  })
});

//Redirect to the original link when short link is provided
app.get('/api/shorturl/:id',(req,res)=>{
  const { id }= req.params;
  const link = lists.find(l=>l.short_url==id);
  if(link){
  return res.redirect(link.original_url);
  }
  return res.json({error:"NO LINK FOUND"});
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});
