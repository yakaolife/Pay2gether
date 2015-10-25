var React = require('react');
var ReactDOM = require('react-dom')
var RaisedButton = require('material-ui/lib/raised-button');
var List = require('material-ui/lib/lists/list');
var ListItem = require('material-ui/lib/lists/list-item');
var AppBar = require('material-ui/lib/app-bar');
var Avatar = require('material-ui/lib/avatar');
var IconButton = require('material-ui/lib/icon-button');
var IconContentAdd = require('material-ui/lib/svg-icons/content/add');
var FlatButton = require('material-ui/lib/flat-button');
var NavigationArrowBack = require('material-ui/lib/svg-icons/navigation/arrow-back');

var PoolDetailTitle = React.createClass({
  render: function() {
    console.log("title=" + this.props.title);
    return (
        <AppBar
            title={this.props.title}
            iconElementLeft={<IconButton onClick={this.props.toHomePageView}><NavigationArrowBack /></IconButton>} />);
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
      member_list.push(<PoolDetailMember key={member} member={member} />);
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
    var that=this;
    return (
        <ListItem
            key={that.props.time}
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
              key={transaction.Time}
              user={transaction.User}
              amount={transaction.Amount}
              time={transaction.Time}
              description={transaction.Description} />);
    }
    transactions.reverse();
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
          <PoolDetailTitle title={this.state.Name} toHomePageView={this.props.toHomePageView}/>
          <PoolDetailMembers members={this.state.Members} />
          <PoolDetailValue limit={this.state.MoneyValue} remaining={this.state.CurrentValue} num_members={this.state.Members.length} />
          <PoolDetailHistory transactions={this.state.Transactions} />
        </div>
    );
  }
});


// ================================================================================================================

var AddPoolPageView = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
            console.log('AppPoolRender');
    return (
      <div>
        <AppBar title="Pools"
          iconElementLeft={<FlatButton label="Cancel" onClick={this.props.toHomePageView}/>}
          iconElementRight={<FlatButton label="Create" onClick={this.props.toHomePageView}/>}
        />
      </div>
    );
  }
});

var HomePageView = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
            console.log('HomeViewRender');
            console.log(this.props);
    return (
      <div>
        <AppBar title="Pools"
          iconElementRight={
            <IconButton onClick={this.props.toAddPoolPageView}>
              <IconContentAdd />
            </IconButton>
          }
        />
        <PoolList toPoolDetail={this.props.toPoolDetail}/>
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

    console.log('initital pools');
    this.socket.on('returnAllPools', function(pools) {
      console.log('get Pools');
      console.log(pools);
      that.setState({pools: pools});
    });
    this.socket.emit('getAllPool');
  },

  render: function() {
    if (this.state.pools) {
      var that = this;
      var PoolItems = this.state.pools.map(function(pool) {
        return (<PoolItem key={pool.Name} pool={pool} toPoolDetail={that.props.toPoolDetail}/>);
      });
    } else {
      var PoolItems = [];
    }
    return (<List> {PoolItems} </List>);
  }
});

var PoolItem = React.createClass({
  render: function() {
    var that = this;
    return (
      <ListItem
        leftAvatar={<Avatar src="asset/people_1.png" />}
        primaryText={this.props.pool.Name}
        secondaryText={this.props.pool.MoneyValue}
        onClick={that.props.toPoolDetail.bind(null, that.props.pool.Name)}
      />);
  }
});

var Pay2getherApp = React.createClass({
	getInitialState: function () {
		return {
			words: "Hello Pay2gether App ^ o^",
      viewName: "HomePageView",
      poolName: "",
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

  changeToHomePageView: function(event) {
    this.setState({viewName: 'HomePageView'});
                          console.log(this.state.viewName);
                          console.log(event);
  },

  changeToAddPoolPageView: function(event) {
    this.setState({viewName: 'AddPoolPageView'});
                          console.log(this.state.viewName);
                          console.log(event);
  },

  changeToPoolDetail: function(poolName) {
    this.setState({viewName: 'PoolDetail', poolName: poolName});
                          console.log(this.state.viewName);
                          console.log(event);
  },

	render: function() {
            console.log('App render');
    if (this.state.viewName == 'HomePageView') {
      var View =
        <HomePageView
          toAddPoolPageView={this.changeToAddPoolPageView}
          toPoolDetail={this.changeToPoolDetail}
        />;
    } else if (this.state.viewName == 'AddPoolPageView') {
      var View =
        <AddPoolPageView
          toHomePageView={this.changeToHomePageView}
        />;
    } else if (this.state.viewName == 'PoolDetail') {
      var View =
        <PoolDetail
          toHomePageView={this.changeToHomePageView}
          poolName={this.state.poolName}
        />;
    }
		return (
			<div>
        {View}
			</div>
		);
	}
});

ReactDOM.render(
	<Pay2getherApp/>,
	document.getElementById('content')
);
