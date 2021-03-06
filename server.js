var braintree=require('braintree');
var express = require('express');
var app = require('express')();
var http=require('http');

var fs = require('fs');
var url = require('url');
var path = require('path');

app.use('/material-ui', express.static(__dirname + '/node_modules/material-ui/'));

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

	//Braintree
	socket.on('getClientToken', function(callback){
		gateway.clientToken.generate({}, function(err, response){
			//Probably should do error handling?
			//response.send(response.clientToken);
			console.log("Call Gateway with response "+response.clientToken);
			if(response.clientToken){
				//socket.emit('getClientToken', response.clientToken);
				callback(response.clientToken, null);
			}else{
				console.error("Cannot get clientToken :(");
				callback(null, "Cannot get client token");
			}
		});
	});


	//Pool

	socket.on('getAllPool', function(){
		console.log("getAllPool: will return all pools info");
		fs.readFile('_pools.json', 'utf8', function(error, pools){
			pools = JSON.parse(pools);
			socket.emit('returnAllPools', pools);
		});

	});

	socket.on('getPoolInfo', function(poolName, callback){
		console.log("getPool: will return pool info");
		fs.readFile('_pools.json', 'utf8', function(error, pools){
			pools = JSON.parse(pools);
			var found = false;

			for(var i=0; i<pools.length; i++){
				//console.log("PoolName: "+ pools[i].Name);
				if(pools[i].Name == poolName){
					found = true;
					console.log("FOUND MATCH! "+pools[i].Name);
					callback(pools[i], null);

				}
			}

			console.log("found: "+found);
			if(!found){
				console.log("Not found");
				callback(null, "No Pool");
			}

		});

	});

	socket.on('createPool', function(newPool, callback){
		console.log("Create Pool");
		//Read the _pools.json file first
		fs.readFile('_pools.json', 'utf8', function(error, pools){
			pools = JSON.parse(pools);
			pools.push(newPool);
			fs.writeFile('_pools.json', JSON.stringify(pools, null, 4), function(error){
				console.log("Write pools file");
				callback(error);
				socket.emit('returnAllPools', pools);
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
		//Read the _pools.json file first
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


	socket.on('chargeValue', function(pool, chargeValue, callback){
		console.log("Charge money: need to give me the Pool name and amount");
		fs.readFile('_pools.json', 'utf8', function(error, pools){
			pools = JSON.parse(pools);
			var matchedPool = null;

			for(var i = 0; i<pools.length; i++){
				if(pools[i].Name == pool.Name){
					matchedPool = pools[i];
					console.log("Found the pool, now charge");
					//TODO: do we need to convert from string to int?
					pools[i].CurrentValue -=chargeValue;

					//Using braintree for transaction

					// gateway.paymentMethod.create({
					//   customerId: "12345",
					//   paymentMethodNonce: nonceFromTheClient
					// }, function (err, result) { });

					gateway.transaction.sale({
						  amount: chargeValue,
						  paymentMethodNonce: "fake-valid-nonce",
						  options: {
						    submitForSettlement: true
						  }
						}, function (error, result) {
							console.log("Finished transaction");
							if(error){
								console.log("ERROR");
							}else{
								console.log("OK!");
							}
					});



					callback(pools[i], error);
				}
			}

			if(matchedPool){
				fs.writeFile('_pools.json', JSON.stringify(pools, null, 4), function(matchedPool, error){
					console.log("Write updated pool file");
					//callback(matchedPool, error);
				});
			}else{
				callback(null, "For some reason cannot find the pool");
			}
		})

	});

});






