import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Accounts} from 'meteor/accounts-base'

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});

import './main.html';

import {Todos} from '../api/todos.js'

const tasks = [
	{text: 'Pickup kids from school'},
	{text: 'Go food shopping'},
	{text: 'Meeting with Bo'}
];

Template.main.onCreated(function mainOnCreated(){
	Meteor.subscribe('todos');
});

Template.main.helpers({
  title: function() {
    return "Quick TODOS";
  },
  todos: function(){
  	return Todos.find({});
  }
});

Template.main.events({
	'submit.todo-form'(event){
		event.preventDefault();
		//console.log("Submitted");

		const name = event.target.name.value;
		const time = event.target.time.value;

		Meteor.call('todos.insert',name, time)

		event.target.name.value = '';
		event.target.time.value = '';
	}
});

Template.todo.events({
	'click .toggle-checked'(event){
			Meteor.call('todos.setChecked', this._id,!this.checked);
	},
	'click .delete'(event){
		Meteor.call('todos.remove',this._id);
	},
	'click .toggle-private'(event){
		Meteor.call('todos.setPrivate',this._id,!this.private);
	}
});

Template.todo.helpers({
	isOwner(){
		return this.owner == Meteor.userId();
	}
});

