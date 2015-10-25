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
    return (
        <AppBar
            title="Tahoe Ski Trip"
            iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>} />);
  }
});

var PoolDetailPeople = React.createClass({
  render: function() {
  }
});

var PoolDetailRemaining = React.createClass({
});

var PoolDetailHistory = React.createClass({
});

var PoolDetail = React.createClass({
  render: function() {
    return (
        <PoolDetailTitle />
        <PoolDetailPeople />
        <PoolDetailRemaining />
        <PoolDetailHistory />
    );
  }
});

ReactDOM.render(
	<PoolDetails />,
	document.getElementById('content')
);
