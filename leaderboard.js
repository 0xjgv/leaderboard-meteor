// Leaderboard App
PlayersList = new Mongo.Collection('players');

if (Meteor.isClient) {

  Meteor.subscribe('thePlayers');
  

  Template.leaderboard.helpers({
    player: function(){
      var currentUserId = Meteor.userId();
      return PlayersList.find({createdBy: currentUserId},
                              {sort: {score: -1, name: 1}});
    },
    count: function(){
      return PlayersList.find().count();
    },
    selectedClass: function() {
      var selectedPlayer = Session.get('selectedPlayer');
      if (this._id === selectedPlayer) {return 'selected';}
  },
    showSelectedPlayer: function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne(selectedPlayer);
    }
  });

  Template.leaderboard.events({
    'dblclick .player': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      var confirmed = confirm("Do you want to remove " + selectedPlayer.name);
      //if confirm, remove the player
      if (confirmed) PlayersList.remove(selectedPlayer);
    },
    'click .player': function(){
      console.log(this.name);
      Session.set('selectedPlayer', this._id);
    },
    'click .increment': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: 5}});
    },
    'click .decrement': function() {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: -5}});
    },
    'click a': function(event){
      event.preventDefault();
    },
  });

  Template.addplayers.events({
    'submit form': function(event){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      var currentUserId = Meteor.userId();
      PlayersList.insert({
        name: playerNameVar,
        score: 0,
        createdBy: currentUserId,
      });
      console.log(playerNameVar);
      console.log(currentUserId);
      event.target.playerName.value = '';
    },
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("Everything working on the server");
    Meteor.publish('thePlayers', function(){
      var currentUserId = this.userId;
      return PlayersList.find({createdBy: currentUserId});
    });
  });
}
