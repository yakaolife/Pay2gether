var clientToken = "Test"; //TODO: Can I do this?

var TestButton = React.createClass({
	handleClick: function(e){

		console.log("The button is clicked!");
		this.socket = io();
		// this.socket.on('backToClient', function (result) {
		// 	console.log("Socket on buttonClick, result:");
		// 	console.log(result);
		// });
		this.socket.emit('click');

	},

	render:function(){
		return(
			<button type="button" onClick={this.handleClick}> {this.props.text}</button>
		);
	}
});

var Brain = React.createClass({
	getInitialState: function () {
		return {
			words: "Hello BrainTree",
			//clientToken: null
		};
	},

	componentDidMount: function () {
		var that = this;
		this.socket = io();
		// this.socket.on('backToClient', function (response) {
		// 	//Apparently we are out of scope now....
		// 	that.setState({words: response});
		// });
		this.socket.on('getClientToken', function(token){
			that.setState({words: "Connected"});
			//Set the global client token
			clientToken = token;
			console.log("clientToken is "+ clientToken);
			braintree.setup(clientToken, "dropin", {
  				container: "payment-form"
			});
		})
	},

	render: function() {
		return (
			<div>
				<h1>{this.state.words}</h1>
				<TestButton text = "Connect BrainTree?"/>
			</div>
		);
	}
});

React.render(
	<Brain/>,
	document.getElementById('content')
);