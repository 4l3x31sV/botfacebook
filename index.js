var express = require("express");
var bodyParser = require("body-parser")
var request = require('request')

const APP_TOKEN = 'EAAJcQc9ZChkwBAAI7gLzkn3LxUhG8Ggo2ACl3rgo4vrkrBMp7ZAnSc75iZCJSRuHIEn109ZCbFjK1pNMQZBtKrBazcINCz2AnUk0GFSE8ZAZAHNGUU2g7wuCVYQask38YEM0P6Nz8KIzdGPmN9dl6texkP2SmkfoXMWeqb2Xe6tHK3B2XZA2EbwV'

var app = express();

app.use(bodyParser.json())

app.listen(4000, function () {
    console.log("Servidor Iniciado puerto 4000")
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
    }else if(isContain(messageText,'info')){
        mensaje = 'Hola que tal nuestro numero de telefono es: 68047892\n mi correo es: alexeis.carrillo@gmail.com'
    }else if(isContain(messageText, 'perro')){
        enviarMensajeImagen(senderID);
    }else if(isContain(messageText, 'perfil')){
        enviarMensajeTemplate(senderID);
    }else{
        mensaje= "Aun no puedo respondera tu petición.!!! :("
    }
    enviarMensajeTexto(senderID, mensaje)
}
function enviarMensajeTemplate(senderID){
    var messageData ={
        recipient:{
            id: senderID
        },
        message:{
            attachment:{
                type: "template",
                payload:{
                    template_type: 'generic',
                    elements:[elementTemplate(),elementTemplate()]
                }
            }
        }
    }
    callSendAPI(messageData)
}
function elementTemplate(){
    return {
        title: "Alexeis Vladimir Carrillo Pinaya",
        subtitle: "Programador Fullstack",
        item_url: "https://www.facebook.com/Yvaganet-1917045965184522/?modal=admin_todo_tour",
        image_url: "https://s-media-cache-ak0.pinimg.com/564x/ef/e8/ee/efe8ee7e20537c7af84eaaf88ccc7302.jpg",
        buttons: [
            buttonTemplate('Contactame','https://www.facebook.com/Yvaganet-1917045965184522/?modal=admin_todo_tour'),
            buttonTemplate('Portafolio','https://www.facebook.com/Yvaganet-1917045965184522/?modal=admin_todo_tour/')
        ]
    }
}
function buttonTemplate(title, url){
    return {
        type: 'web_url',
        url:url,
        title: title
    }
}
function enviarMensajeImagen(senderID){
    var messageData = {
        recipient: {
            id: senderID
        },
        message:{
            attachment:{
                type: "image",
                payload:{
                    url: "https://s-media-cache-ak0.pinimg.com/564x/ef/e8/ee/efe8ee7e20537c7af84eaaf88ccc7302.jpg"
                }
            }
        }
    }
    callSendAPI(messageData)
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
