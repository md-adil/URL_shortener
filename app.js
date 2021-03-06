const express = require('express');
const app = express();
var admin = require('firebase-admin');
var port = 1123||process.env.port;


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', function(req,res){
    res.render('index', {});
})

app.set('view engine', 'hbs')

 
// To-do : Add checks for repetition of key or original URL
//          Improve the shortened URL so that it works on different search engines
//          Integrate properly
//          Redirect after shortening a URL
//          Improve UI of list

const urlShortner = require('./controllers/urlShortnerController');


// Get a database reference to firebase
var db = require('./db');


// Creates a short URL for a single long URL
app.post('/', urlShortner.shorten);


// List all the shortened URLs
app.get('/list', function(req,res){
    var arr=[];
    db.ref('shorten_urls').once('value').then(function(snapshot) {
        x = snapshot.val();   
        console.log("out")
        res.render('after_req', {msg : x});
    });
})

app.get('/favicon.ico', (req, res) => {
    return res.status(404).send();
});


// Redirecting to proper url from short URL

app.get('/:link', urlShortner.find);

// 404 Handler
app.use(function(req,res){
    res.render('404')
})

// Start server
app.listen(port, function(){
    console.log(`Server listening on ${port}`)
})