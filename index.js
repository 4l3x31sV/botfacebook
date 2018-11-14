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