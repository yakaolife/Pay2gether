var React = require('react');
var ReactDOM = require('react-dom')
var RaisedButton = require('material-ui/lib/raised-button');

var clientToken = "Test";

var TestButton = React.createClass({
	handleClick: function(e){

		console.log("The button is clicked!");
		this.socket = io();
		this.socket.emit('click');

	},

	render:function(){
		return(
			<button type="button" onClick={this.handleClick}> {this.props.text}</button>
		);
	}
});

var PoolList = React.createClass({
  getInitialState: function() {
    return {
      pools: null
    };
  },

  componentDidMount: function() {
    var that = this;
    this.socket = io();

    this.socket.on('returnAllPoolss', function(pools) {
      that.setState({pools: pools});
    });
    this.socket.emit('getAllPool');
    this.setState({pools: [{Name: "AAA", MoneyValue: 123}, {Name: "BBB", MoneyValue: 456}]});
  },

  render: function() {
    if (this.state.pools) {
      Pools = this.state.pools.map(function(pool) {
        return (<Pool pool={pool}>);
      });
    } else {
//      Pools = <div>No pool created</div>;
    }
    return <List subheader="Pools"> {Pools} </List>;
  }
});

var Pool = React.createClass({
  render: function() {
    return
      <div>
        {this.props.pool.Name} :
        {this.props.pool.MoneyValue}
      </div>;
  }
});

var Pay2getherApp = React.createClass({
	getInitialState: function () {
		return {
			words: "Hello Pay2gether App ^ o^",
		};
	},

	componentDidMount: function () {
		var that = this;
		this.socket = io();
		this.socket.on('getClientToken', function(token){
			that.setState({words: "Connected"});
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
        <PoolList />
			</div>
		);
	}
});

ReactDOM.render(
	<Pay2getherApp/>,
	document.getElementById('content')
);
