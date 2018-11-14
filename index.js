var express = require("express");
var bodyParser = require("body-parser")
var request = require('request')

const APP_TOKEN = 'EAAZAJeh3ianIBAHFf38mR0cZBFXZC5QweMKgj6Vk5MZBvNuQYBCtOWpZBfEZBymGvBU1X4kerp1I5KxpNsoniSIrHQBI6jV7T5MSu2qza5GiEK4M3FmzZB97nplOhAGZAaF7jqJh8Qt6lFoZAD9GxZCAYf8ZAkVPTwWVPAUDeyGuWjYidE0BOvZCZChBx'

var app = express();

app.use(bodyParser.json())

app.listen(3000, function () {
    console.log("Servidor Iniciado puerto 3000")
})

app.get("/", function (req,res) {
    res.send("Bienvenido");
})

app.get('/webhook',function(req, res){
    if(req.query['hub.verify_token'] === 'hello_token'){
        res.send(req.query['hub.challenge'])
    }else{
        res.send('Tu no tienes que entrar aqui')
    }
})

app.post("/webhook",function (req,res) {
    var data = req.body;
    console.log(JSON.stringify(data))
    if(data.object == 'page'){
        data.entry.forEach(function (pageEntry) {
            pageEntry.messaging.forEach(function (messagingEvent) {
                if(messagingEvent.message) {
                    receiveMessage(messagingEvent)
                }
            })
        })
    }
    res.sendStatus(200)
})

function receiveMessage(event){
    var senderID = event.sender.id;
    var messageText = event.message.text;
    evaluarMensaje(senderID,messageText)
}
function evaluarMensaje(senderID, messageText){
    var mensaje = 'Dijiste ' + messageText;
    if(isContain(messageText,'hola')){
        mensaje = 'Hola Bienvenido'
    }
    enviarMensajeTexto(senderID, mensaje)
}
function enviarMensajeTexto(senderID, mensaje){
    var messageData = {
        recipient:{
            id: senderID
        },
        message: {
            text: mensaje
        }
    }
    callSendAPI(messageData);
}
function callSendAPI(messageData){
    //api de facebook
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: APP_TOKEN},
        method: 'POST',
        json: messageData
    },function(error, response, data){
        if(error)
            console.log('No es posible enviar el mensaje')
        else
            console.log('Mensaje enviado...')
    })
}
function isContain(texto, word){
    if(typeof texto=='undefined' || texto.lenght<=0) return false
    return texto.indexOf(word) > -1
}
