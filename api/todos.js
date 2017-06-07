import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Todos = new Mongo.Collection('todos');

if (Meteor.isServer){
	Meteor.publish('todos', function tasksPublication(){
		var id = this.userId;
		var transform = function(myTodo,userId){
			if (myTodo.owner != userId && myTodo.private == true)
				{console.log(myTodo.owner);
					console.log(userId);
				myTodo.name = "**PRIVATE**";}
      		return myTodo;
      	}

  var self = this;

  var observer = Todos.find().observe({
      added: function (document) {
      self.added('todos', document._id, transform(document,id));
    },
    changed: function (newDocument, oldDocument) {
      self.changed('todos',newDocument._id, transform(newDocument,id));
    },
    removed: function (oldDocument) {
      self.removed('todos', oldDocument._id);
    }
  });

  self.onStop(function () {
    observer.stop();
  });

  self.ready();

});
}

Meteor.methods({
	'todos.insert'(name,time){
		check(name,String);
		check(time,String);

		if(! this.userId){
			throw new Meteor.Error('Unauthorized');
		}

		Todos.insert({
			name: name,
			time: time,
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username

		});
	},
	'todos.remove'(taskId){
		check(taskId, String);

		const task = Todos.findOne(taskId);

		if(task.owner != this.userId){
			throw new Meteor.Error('Unauthorized');
		}
		Todos.remove(taskId);
	},
	'todos.setChecked'(taskId,setChecked){
		check(taskId, String);
		check(setChecked, Boolean);

		const task = Todos.findOne(taskId);

		if(task.owner != this.userId){
			throw new Meteor.Error('Unauthorized');
		}

		Todos.update(taskId,{$set:{checked:setChecked}})
	},
	'todos.setPrivate'(taskId,setToPrivate){
		check(taskId, String);
		check(setToPrivate, Boolean);

		const task = Todos.findOne(taskId);

		if(task.owner != this.userId){
			throw new Meteor.Error('Unauthorized');
		}

		Todos.update(taskId,{$set:{private:setToPrivate}})
	}
	
});
