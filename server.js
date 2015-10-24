
var braintree=require('braintree');
var express = require('express');
var app = require('express')();
var http=require('http');

var fs = require('fs');
var url = require('url');
var path = require('path');

var server = app.listen(8081);
console.log('Server listening on port 8081');

// Socket.IO part
var io = require('socket.io')(server);



var gateway=braintree.connect({
	environment:braintree.Environment.Sandbox,
	merchantId: "4s2bz328sgj8h75b",
	publicKey:"t3xh48knfw2zxzv9",
	privateKey:"0c52e5917f8e580e62b849b1774a9788"
});



app.use('/', express.static(path.join(__dirname, 'public')));
io.on('connection', function(socket){
	console.log("A user connected");
	socket.on('click', function(){
		console.log("node got the click");

		gateway.clientToken.generate({}, function(err, response){
			//Probably should do error handling?
			//response.send(response.clientToken);
			console.log("Call Gateway with response "+response.clientToken);
			if(response.clientToken){
				socket.emit('getClientToken', response.clientToken);
			}
		});

		// var response = "Trip back to client";
		// socket.emit('backToClient',response);
	});

	// socket.on('createCustomer', function(customer){
	// 	//customer is a json object containing all the info


	// });

});

//Write POST in Node without library
//http://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
// app.post("/checkout", function (req, res) {
//   var nonce = req.body.payment_method_nonce;
//   // Use payment method nonce here
// });

// gateway.transaction.sale({
//   amount: '10.00',
//   paymentMethodNonce: nonceFromTheClient, //fake-valid-nonce
// }, function (err, result) {
// });

// http.get("/client_token", function(request, response){
// 	console.log("starting gateway");
// 	gateway.clientToken.generate({}, function(err, response){
// 		response.send(response.clientToken);
// 		console.log("app.get is called?");
// 	});
// }).on('error', function(e) {
//   console.log("Got error: " + e.message);
// });





