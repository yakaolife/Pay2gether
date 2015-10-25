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
    return (
        <li>
          <div style=
            {{
              maxWidth: 48 + 'px',
            }}>
            <Avatar src='asset/people_1.png' />
            <div>{this.props.member}</div>
          </div>
        </li>
    );
  }
});

var PoolDetailMembers = React.createClass({
  render: function() {
    var member_list = [];
    var member;
    for (member of this.props.members) {
      member_list.push(<PoolDetailMember member={member} />);
    }
    return (<ul>{member_list}</ul>);
  }
});

var PoolDetailValue = React.createClass({
  render: function() {
    var total_remaining = this.props.remaining;
    var my_remaining = total_remaining / this.props.num_members;
    var portion_remaining = this.props.remaining / this.props.limit;
    return (
        <div style=
          {{
            width: 300 + 'px',
            margin: 'auto'
          }}>
          <div style=
            {{
              fontSize: 60,
            }}>
            {total_remaining}
          </div>
          <div style=
            {{
              verticalAlign: 'text-bottom',
              fontSize: 24
            }}>
            {'My: ' + my_remaining}
          </div>
        </div>);
  }
});

var PoolDetailTransaction = React.createClass({
  timeAgo: function() {
    var transaction_time = new Date(this.props.time);
    var now = new Date().getTime();
    var milisec_diff = now - transaction_time.getTime();
    var days = Math.floor(milisec_diff / 1000 / 60 / 60 / 24);
    if (days > 1) {
      return days + " days ago";
    } else if (days == 1) {
      return "1 day ago";
    }
    var hours = Math.floor(milisec_diff / 1000 / 60 / 60);
    if (hours > 1) {
      return hours + " hours ago";
    } else if (hours == 1) {
      return "1 hour ago";
    }
    var minutes = Math.floor(milisec_diff / 1000 / 60);
    if (minutes > 1) {
      return minutes + " minutes ago";
    } else {
      return "Just now";
    }
  },

  render: function() {
    return (
        <ListItem
            leftAvatar={<Avatar src='asset/people_1.png' />}
            primaryText={<span><span>{this.props.user}</span> <span style={{color: 'lightGrey'}}>{this.timeAgo()}</span></span>}
            secondaryText={'Spent $' + this.props.amount + ' for ' + this.props.description}
            />);
  }
});

var PoolDetailHistory = React.createClass({
  render: function() {
    var transactions = []
    var transaction;
    for (transaction of this.props.transactions) {
      transactions.push(
          <PoolDetailTransaction
              user={transaction.User}
              amount={transaction.Amount}
              time={transaction.Time}
              description={transaction.Description} />);
    }
    return (<List subheader="Transactions">{transactions}</List>);
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
          <PoolDetailValue limit={this.state.MoneyValue} remaining={this.state.CurrentValue} num_members={this.state.Members.length} />
          <PoolDetailHistory transactions={this.state.Transactions} />
        </div>
    );
  }
});

ReactDOM.render(
	<PoolDetail poolName='Money2020' />,
	document.getElementById('content')
);
