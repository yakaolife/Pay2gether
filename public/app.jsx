var React = require('react');
var ReactDOM = require('react-dom')
var RaisedButton = require('material-ui/lib/raised-button');
var List = require('material-ui/lib/lists/list');
var ListItem = require('material-ui/lib/lists/list-item');
var AppBar = require('material-ui/lib/app-bar');
var Avatar = require('material-ui/lib/avatar');
var IconButton = require('material-ui/lib/icon-button');
var IconContentAdd = require('material-ui/lib/svg-icons/content/add');

var HomePageView = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      <div>
        <AppBar title="Pools"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          iconElementRight={<IconButton><IconContentAdd /></IconButton>}/>
        <PoolList/>
      </div>
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
      var PoolItems = this.state.pools.map(function(pool) {
        return (<PoolItem key={pool.Name} pool={pool} />);
      });
    } else {
      var PoolItems = [];
    }
    return (<List> {PoolItems} </List>);
  }
});

var PoolItem = React.createClass({
  render: function() {
    return (
      <ListItem
        leftAvatar={<Avatar src="asset/people_1.png" />}
        primaryText={this.props.pool.Name}
        secondaryText={this.props.pool.MoneyValue}
      />);
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
        <HomePageView />
			</div>
		);
	}
});

ReactDOM.render(
	<Pay2getherApp/>,
	document.getElementById('content')
);
