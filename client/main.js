import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { fetch } from "meteor/fetch"
let keyJson = require('.keys.json');


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

Template.home.onCreated(function homeOnCreated() {
  let ctrl = this;
  this.movies = new ReactiveVar();
  this.config = new ReactiveVar();
  fetch('https://api.themoviedb.org/3/configuration?api_key='+keyJson.tmdb+'&language=fr-FR').then(res=>{
    res.json().then(json=>{
      ctrl.config.set(json.results);
    })
  });
  fetch('https://api.themoviedb.org/3/discover/movie?api_key='+keyJson.tmdb+'&language=fr-FR').then(res=>{
    res.json().then(json=>{
      ctrl.movies.set(json.results);
    })
  });
});

Template.home.events({
  'click .like-button'(event, instance) {
    // increment the counter when button is clicked
    //instance.counter.set(instance.counter.get() + 1);
    console.log(event.currentTarget.dataset.movieid);
  },
});

Template.home.helpers({
  movies() {
    return Template.instance().movies.get();
  },
  config(){
    return Template.instance().config.get();
  }
});