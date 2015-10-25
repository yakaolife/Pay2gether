var React = require('react');
var ReactDOM = require('react-dom')
var NavigationArrowBack = require('material-ui/lib/svg-icons/navigation/arrow-back');
var AppBar = require('material-ui/lib/app-bar');
var IconButton = require('material-ui/lib/icon-button');
var Avatar = require('material-ui/lib/avatar');
var List = require('material-ui/lib/lists/list');
var ListItem = require('material-ui/lib/lists/list-item');

var PoolDetailTitle = React.createClass({
  render: function() {
    console.log("title=" + this.props.title);
    return (
        <AppBar
            title={this.props.title}
            iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>} />);
  }
});

var PoolDetailMember = React.createClass({
  render: function() {
    return (<div />);
  }
});

var PoolDetailMembers = React.createClass({
  render: function() {
    return (<div />);
  }
});

var PoolDetailValue = React.createClass({
  render: function() {
    return (<div />);
  }
});

var PoolDetailHistory = React.createClass({
  render: function() {
    return (<div />);
  }
});

var PoolDetail = React.createClass({
  getInitialState: function() {
    return {
      Name: "",
      MoneyValue: 0,
      CurrentValue: 0,
      Members: [],
      Transactions: []
    };
  },

  getPoolDetail: function() {
    // TODO: Maybe the socket could be passed as a prop from the parent instead?
    this.socket = io();
    var that = this;
    this.socket.emit('getPoolInfo', this.props.poolName, function(pool, msg) {
      if (msg) {
        console.log("getPoolInfo: from server: " + msg);
      }
      if (pool) {
        console.log("getPoolInfo: setState");
        that.setState(pool);
      }
    });
  },

  componentDidMount: function() {
    this.getPoolDetail(this.props.poolName);
  },

  render: function() {
    return (
        <div>
          <PoolDetailTitle title={this.state.Name} />
          <PoolDetailMembers members={this.state.Members} />
          <PoolDetailValue limit={this.state.MoneyValue} current={this.state.CurrentValue} />
          <PoolDetailHistory transactions={this.state.Transactions} />
        </div>
    );
  }
});

ReactDOM.render(
	<PoolDetail poolName='Money2020' />,
	document.getElementById('content')
);
