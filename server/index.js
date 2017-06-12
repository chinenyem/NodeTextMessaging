'use strict';

const express = require('express');
const app = express();
const server = app.listen(4000);

const bodyParser = require('body-parser');
const ejs = require('ejs');

const nexmop = require('nexmo');
const nexmo = new nexmop({
  apiKey:'15f9de73',
  apiSecret:'f4fdf8f96a39836a'
}, {debug:true});

const socketio = require('socket.io');
const io = socketio(server);

io.on('connection', (socket)=>{
  console.log('Connected');
  socket.on('disconnect', () =>{
    console.log('Disconnected');
  });
});

app.set('views', __dirname + '/../views');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req,res) =>{
  res.render('index');
});

app.post('/', (req, res) =>{
  res.send(req.body);
  console.log(req.body);
  let toNumber = req.body.number;
  let text = req.body.text;
  let number = 12016057134;
  nexmo.message.sendSms(
    number, toNumber, text, {type:'unicode'},
    (err, responseData) =>{
      let data = {}
      if(err){
        console.log(err);
      }else{
          console.dir(responseData);
          // console.log(responseData.messages[0]['message-id'])
          // console.log(responseData.messages[0]['to'])
          // console.log("worked")

         data['id'] = responseData.messages[0]['message-id']
         data['number'] = responseData.messages[0]['to']

        }
        //console.log('data');
        console.log(data);
        io.emit('smsStatus', data);

    }
  );
});
