import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
var HTTP = require('http');


import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

/* Template.home.onCreated(function homeOnCreated() {
  let ctrl = this;
  this.movies = new ReactiveVar();
  HTTP.call('GET', 'http://localhost:3000/api/discover/movie', {},
    function (error, response) {
      // Handle the error or response here.
      ctrl.movies.set(JSON.parse(response.content).results)
    });
});

Template.home.helpers({
  movies() {
    return Template.instance().movies.get();
  }
}); */