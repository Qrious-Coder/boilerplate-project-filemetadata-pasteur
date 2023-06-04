var express = require('express');
var cors = require('cors');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
// connect to mongodb
const { MongoClient } = require("mongodb");
const database = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
database.connect();

app.post('/api/fileanalyse', upload.single('upfile'), function(req,res) {
  var file = req.file;
  var meta = { name: file.orginalname, 
    type: file.mimetype,
    size: file.size
  }
  const dataObj = database.db("file_metadata")
  dataObj.collection("files").insertOne( meta, function(err, res) {
    if(err) throw err;
    console.log("file inserted successfully!")
    database.close()
  })
    
  res.json(meta)  
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
