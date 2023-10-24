/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

"use strict";

// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  app = express().use(body_parser.json()), // creates express http server
  cors = require('cors');
  



// Configurar cabeceras CORS
express().use(cors())
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening" + " " + process.env.PORT));


// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));
  //from: req.body.entry[0].changes[0].value.messages[0] ? req.body.entry[0].changes[0].value.messages[0].from : null,
  //console.log(req.body)
  let url_handalbay = "http://localhost:3001/static_resources/api/v1/cities/get_departments";
  if (req.body.entry[0].changes[0].value.statuses[0].status == "read"){
    console.log("entre porque mi estado es leido")
  }else if (req.body.entry[0].changes[0].value.messages[0].context.id){
    console.log("Si respondio por respuesta rapida")
  }else if(){
    
  }
  /*axios.post(url_handalbay, body)
    .then(response => {
      console.log('Datos guardados exitosamente en Rails:', response.data);
      //res.status(200).send(response.data);
    })
    .catch(error => {
      console.error('Error al guardar datos en Rails:', error);
      //res.sendStatus(500); // o cualquier otro código de error adecuado
    });*/
  /*axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url: url_handalbay,
    data: body,
  })
    .then((response) => {
      console.log("Datos guardados exitosamente en Rails:", response.data);
      //res.status(200).send(response.data);
    })
    .catch((error) => {
      console.error("Error al guardar datos en Rails:", error);
      //res.sendStatus(500); // o cualquier otro código de error adecuado
    });*/
    
  
  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      //let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      /*axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v17.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Gracias por tu mensaje pero la respuesta es limitada" },
        },
        headers: { "Content-Type": "application/json" },
      });*/
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
