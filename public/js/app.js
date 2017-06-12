//(function(){
'use strict';
  const numberField = document.querySelector('input[name=number]');
  const textField = document.querySelector('input[name=text]');
  const button = document.querySelector('input[name=button]');
  const msg = document.querySelector('.response');
  const place = document.getElementsByClassName("response");
  const socket = io();

  textField.addEventListener('keyup', function(e){
    if((e.keycode || e.charCode) === 13 ) send();
  }, false); //when use press return key

  button.addEventListener('click', send, false); //when user clicks send button


  function send(){
    const number = numberField.value.replace(/\D/g,''); // remove all non numer chars
    const text = textField.value;

    fetch('/',{
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({number:number, text:text})
    })
    .then(function(res){console.log(res)})
    .catch(function(error){console.log(error)});
  }


  function displayStatus(message){
    const notification = new Notification('Nexmo',{
      body:message,
      icon: 'images/icon-nexmo.jpg'
    });
  }


  socket.on('smsStatus', function(data){
    displayStatus('Message ID ' + data.id + ' successfully sent to ' + data.number);
    place[0].innerHTML = 'Message ID ' + data.id + ' successfully sent to ' + data.number
  });

  Notification.requestPermission().then(function(status){
    console.log(status);
  });




//})()
