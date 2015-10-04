Meteor.startup(function () {

  Meteor.publish('thePlayers', function(){
    return PlayersList.find({createdBy: this.userId});
  });

  Meteor.methods({
    insertPlayerData: function (playerNameVar) {
      PlayersList.insert({
        name: playerNameVar,
        score: 0,
        createdBy: Meteor.userId(),
      });
    },

    removePlayerData: function (selectedPlayer) {
      PlayersList.remove({_id: selectedPlayer, createdBy: Meteor.userId});
    },

    modifyPlayerScore: function (selectedPlayer, scoreValue) {
      PlayersList.update({_id: selectedPlayer, createdBy: Meteor.userId()},
                         {$inc: {score: scoreValue}
                       });
    }
  });
  
});