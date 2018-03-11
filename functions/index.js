'use strict';


const functions = require('firebase-functions');
const request = require('request');
const GeneratorTest = require('./GeneratorTest.js');



const PAGE_ACCESS_TOKEN = "EAACKyJeiaI0BAIQSSYduNxxZCvJkF5UCSBhS0myOfU6iAyTW0LOdCA9ZAixxGZB6NuJdy78pZBVC2dCJo1eupQjiy0E3wK87wypjdbwCZACK7oiIGPYKBnqchwEyHGgn7zgLYwCc99nURxrw8twUXvatMN5fi9OtNENxDdrsSWQZDZD"

const conversation = {
  messages: [
    {
      "id":1,
      "message_content": "What do you want to focus on this week",
      "links": [2, 3, 4, 4, 5],
      "response": null,
      "condition": null,
      "isInitialQuestion": true,

    }
    
  ]
}
// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.get('privacy', (req, res) =>{
  //get a copy of the privacy policy

})
// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "qwet3451324tfqergfwert123451"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  console.log("token is" + token);
  console.log("verify token is " + VERIFY_TOKEN)
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});
app.get('/test', (req, res) =>{
  res.status(200).send("working");
});

app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
      if(webhook_event.message) {
        
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
      
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response; 
  if (received_message.text) {
    response = {

      "text":`${GeneratorTest(sender_psid, received_message.text)}`,
      "quick_replies":[
        {
          "content_type":"text",
          "title":"sad",
          "payload":"sad"

        },
        {
          "content_type":"text",
          "title":"happy",
          "payload":"happy"
        }
      ]
    }
  }
  callSendAPI(sender_psid, response);

}


// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  let request_body = {
    "recipient" : {
      "id": sender_psid
    }, 
    "message": response
  }

  request({
    "uri": "https://httpbin.org/ip",
    "method": "GET",
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });// Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

//handleMessage(SID, "hi");

exports.api = functions.https.onRequest(app);
