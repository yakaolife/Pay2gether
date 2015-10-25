var braintree=require('braintree');
var express = require('express');
var app = require('express')();
var http=require('http');

var fs = require('fs');
var url = require('url');
var path = require('path');

app.use('/material-ui', express.static(__dirname + '/node_modules/material-ui/'));
//app.use('/react', express.static(__dirname + '/node_modules/react/'));
var RaisedButton = require('material-ui/lib/raised-button');

var server = app.listen(8081);
console.log('Server listening on port 8081');

// Socket.IO part
var io = require('socket.io')(server);



// var gateway=braintree.connect({
// 	environment:braintree.Environment.Sandbox,
// 	merchantId: "4s2bz328sgj8h75b",
// 	publicKey:"t3xh48knfw2zxzv9",
// 	privateKey:"0c52e5917f8e580e62b849b1774a9788"
// });



app.use('/', express.static(path.join(__dirname, 'public')));
io.on('connection', function(socket){
	//console.log("A user connected");

	//TODO: need invitation mechanics

	//Group

	socket.on('getAllGroup', function(groupName){
		console.log("getAllGroup: will return group info");
		fs.readFile('_groups.json', 'utf8', function(error, groups){
			groups = JSON.parse(groups);
			socket.emit('returnAllGroups', groups);
		});

	});

	socket.on('getGroupInfo', function(groupName){
		console.log("getGroup: will return group info");
		fs.readFile('_groups.json', 'utf8', function(error, groups){
			groups = JSON.parse(groups);
			matchedGroup = groups.map(function(group){
				if(group.Name == groupName){
					console.log("FOUND MATCH!");
					return group;
				}
			});

			if(matchedGroup){
				socket.emit('returnGroupInfo', matchedGroup);
			}else{
				console.log("Group name not found");
			}

		});

	});

	socket.on('createGroup', function(newGroup, callback){
		console.log("Create Group");
		//Read the _groups.json file first
		fs.readFile('_groups.json', 'utf8', function(error, groups){
			groups = JSON.parse(groups);
			groups.push(newGroup);
			fs.writeFile('_groups.json', JSON.stringify(groups, null, 4), function(error){
				console.log("Write groups file");
				callback(error);
				socket.emit('returnAllGroups', groups);
			});
		});

	});

	//People

	socket.on('getPeople', function(){
		console.log("getPeople: Get all existing people from JSON file");
		fs.readFile('_people.json', 'utf8', function(error, people){
			people = JSON.parse(people);
			socket.emit('returnPeople', people);
		});
	});

	// socket.on('getPerson', function(name){
	// 	console.log("Search for this person: "+ name);
	// });

	socket.on('addNewPerson', function(person, callback){
		console.log("addNewPerson");
		//Read the _groups.json file first
		fs.readFile('_people.json', 'utf8', function(error, people){
			people = JSON.parse(people);
			people.push(person);
			fs.writeFile('_people.json', JSON.stringify(people, null, 4), function(error){
				console.log("Write people file");
				callback(error);
				socket.emit('returnPeople', people);
			});
		});
	});

	//Money

	socket.on('chargeMoney', function(parameter){
		console.log("Charge money: need to give me the group name and amount");
	});

});


// fs.readFile('_comments.json', 'utf8', function(err, comments) {
// 	comments = JSON.parse(comments);
// 	comments.push(comment);
// 	fs.writeFile('_comments.json', JSON.stringify(comments, null, 4), function (err) {
// 		io.emit('comments', comments);
// 		callback(err);
// 	});
// });

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





