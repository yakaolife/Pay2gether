var React = require('react');
var ReactDOM = require('react-dom')
var NavigationArrowBack = require('material-ui/lib/svg-icons/navigation/arrow-back');
var AppBar = require('material-ui/lib/app-bar');
var IconButton = require('material-ui/lib/icon-button');
var Avatar = require('material-ui/lib/avatar');
var List = require('material-ui/lib/lists/list');
var ListItem = require('material-ui/lib/lists/list-item');

var PoolDetailsTitle = React.createClass({
  render: function() {
    return (
        <AppBar
            title="Tahoe Ski Trip"
            iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>} />);
  }
});

var PoolDetails = React.createClass({
  render: function() {
    return (<PoolDetailsTitle />);
  }
});

ReactDOM.render(
	<PoolDetails />,
	document.getElementById('content')
);
