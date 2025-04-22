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
  cors = require("cors");

// Configurar cabeceras CORS
express().use(cors());
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () =>
  console.log("webhook is listening" + " " + process.env.PORT)
);

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));
  //from: req.body.entry[0].changes[0].value.messages[0] ? req.body.entry[0].changes[0].value.messages[0].from : null,
  //console.log(req.body)
  
  //let url_handalbay_update_confirmation_participation = "https://testing.handelbay.com.co/static_resources/api/v1/whatsapp_datas/update_confirmation_participation";
  //let url_handelbay_update_message_status = "https://testing.handelbay.com.co/static_resources/api/v1/whatsapp_datas/update_message_status";
  let url_handalbay_update_confirmation_participation = "https://app.handelbay.com.co/static_resources/api/v1/whatsapp_datas/update_confirmation_participation";
  let url_handelbay_update_message_status = "https://app.handelbay.com.co/static_resources/api/v1/whatsapp_datas/update_message_status";
  //let url_handalbay_update_confirmation_participation = "http://localhost:3000/static_resources/api/v1/whatsapp_datas/update_confirmation_participation";
  //let url_handelbay_update_message_status = "http://localhost:3000/static_resources/api/v1/whatsapp_datas/update_message_status";
  
  //verifica si el mjs fue una repuesta diferente a las opciones de una plantilla
  let error_mjs = req.body &&
    req.body.entry &&
    req.body.entry[0] &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0] &&
    req.body.entry[0].changes[0].value &&
    req.body.entry[0].changes[0].value.messages &&
    req.body.entry[0].changes[0].value.messages[0] &&
    !req.body.entry[0].changes[0].value.messages[0].context ? true : false;
  
  //verifica si el mjs de plantilla que enviamos ya fue leido
  let status = req.body &&
    req.body.entry &&
    req.body.entry[0] &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0] &&
    req.body.entry[0].changes[0].value &&
    req.body.entry[0].changes[0].value.statuses &&
    req.body.entry[0].changes[0].value.statuses[0] &&
    req.body.entry[0].changes[0].value.statuses[0].status == "read" ? true : false;
  
  //Verifica si el cambio de estados es de un mjs de plantilla
  let template_true = req.body &&
    req.body.entry &&
    req.body.entry[0] &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0] &&
    req.body.entry[0].changes[0].value &&
    req.body.entry[0].changes[0].value.statuses &&
    req.body.entry[0].changes[0].value.statuses[0] &&
    req.body.entry[0].changes[0].value.statuses[0].pricing ? true : false;
  
  // verifica que no exista ningun estatus 
  let null_status = req.body &&
    req.body.entry &&
    req.body.entry[0] &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0] &&
    req.body.entry[0].changes[0].value &&
    !req.body.entry[0].changes[0].value.statuses ? true : false;
  
  //verifica si el mjs fue una repuesta rapida de una plantilla
  let rapida = req.body &&
    req.body.entry &&
    req.body.entry[0] &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0] &&
    req.body.entry[0].changes[0].value &&
    req.body.entry[0].changes[0].value.messages &&
    req.body.entry[0].changes[0].value.messages[0] && 
    req.body.entry[0].changes[0].value.messages[0].context &&
    req.body.entry[0].changes[0].value.messages[0].context.id ? true : false;
  
  if (status) {
    console.log("entre porque mi estado es leido");
    axios.put(url_handelbay_update_message_status, body)
    .then(response => {
      console.log('Se actualizo el status del mjs:', response.data);
      res.status(200).send(response.data);
    })
    .catch(error => {
      console.error('Error al actualizar el status del mjs:', error);
      res.sendStatus(400); // o cualquier otro código de error adecuado
    });
    //res.status(200)
  }else if (rapida) {
    console.log("Si respondio por respuesta rapida");
    axios.put(url_handalbay_update_confirmation_participation, body)
    .then(response => {
      res.status(200).send(response.data);
    })
    .catch(error => {
      res.sendStatus(500); // o cualquier otro código de error adecuado
    });
    res.status(200)
  }else if (error_mjs && null_status) {
    console.log("No respondio correctamente");
    let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
    let from = req.body.entry[0].changes[0].value.messages[0].from;
    let token = process.env.WHATSAPP_TOKEN
    /*axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v17.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          preview_url: false,
          to: from,
          type: "text",
          text: { 
            body: "Gracias por tu mensaje pero la respuesta es limitada, debes reponder con algunas de las opcines antes dichas."
          },
        },
        headers: { "Content-Type": "application/json" },
      })*/
    res.status(200)
  }else{
    res.status(404)
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
  /*if (req.body.object) {
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
      });
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }*/
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  
   //* UPDATE YOUR VERIFY TOKEN
   //*This will be the Verify Token value when you set up webhook
   
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
