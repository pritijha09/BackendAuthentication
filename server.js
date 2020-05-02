var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken')
app.use(bodyParser.json());
app.use(cors());
var messages = [{text:'hgcvj', owner:'hvjhb'}];
var users = [];

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-control-Allow-Headers", "Origin, X-Requested-With, Content-TypeError, Accept");
//     next();
// })
var api = express.Router();
var auth = express.Router();

api.get('/messages', (req, res) => {
   res.json(messages); 
})

api.post('/message', (req, res) => {
  //console.log(req.body); 
  messages.push(req.body);
  res.sendStatus(200);
});

api.get('/users/me', checkAuthenticated, (req, res) => {
    console.log(req.user);
})

function sendToken(user, res) {
    var token = jwt.sign(user.id, '123');
    res.json({firstName: user.firstName, token});
}

function sendAuthError(res) {
    res.json({success: false, message:'email or password incorrect'});
}

function checkAuthenticated(req, res, next) {
    if(!req.header("authorization"))
    return res.status(401).send({message: 'missing authenti error'});

    var token = req.header("authorization").split(' ')[1];
    var payload = jwt.decode(token, '123');
    if(!payload)
        return res.status(401).send({message: 'unauthe. errors'})

        req.user = payload;
        next();
}

auth.post('/register', (req, res) => {
    users.push(req.body);
    var index = users.length - 1;
    var user = users[index];
    user.id = index;
    sendToken(user, res);
})



auth.post('/login', (req, res) => {
  var user =  users.find(user => user.email === req.body.email);
  if(!user) return sendAuthError(res);
  if(user.password == req.body.password)
  sendToken(user, res);
  else 
  sendAuthError(res);
})


app.use('/api', api);
app.use('/auth', auth);

app.listen(4300);