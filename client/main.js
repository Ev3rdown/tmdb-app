import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { fetch } from "meteor/fetch"
//Router.options.autoStart = false;

import './main.html';

Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', {
  template: 'home'
});
Router.route('/about');

Router.route('/movie/:_id', function () {
  var params = this.params; // { _id: "5" }
  var id = params._id; // "5"
  fetch('/api/movies/details/'+id).then(res=>{
    res.json().then(json=>{
      console.log(json);
      this.render('movie', {
        data: function () {
          console.log(json.title);
          console.log("test");
          return json;
        }
      });
    })
  });
});

/* Template.hello.onCreated(function helloOnCreated() {
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
}); */

Template.home.onCreated(function homeOnCreated() {
  let ctrl = this;
  this.movies = new ReactiveVar();
  fetch('/api/movies/discover').then(res=>{
    res.json().then(json=>{
      console.log(json);
      ctrl.movies.set(json.results);
    })
  });
});

Template.home.events({
  'click .like-button'(event, instance) {
    // increment the counter when button is clicked
    //instance.counter.set(instance.counter.get() + 1);
    let movieId = event.currentTarget.dataset.movieid
    console.log(movieId);
    fetch('/api/movies/like/'+movieId).then(res=>{
      res.json().then(json=>{
        console.log(json);
        if (json.success == true){
          var nblikes = (parseInt(document.getElementsByClassName('likes-'+movieId)[0].dataset.nblikes) + 1).toString();
          document.getElementsByClassName('likes-'+movieId)[0].dataset.nblikes = nblikes;
          document.getElementsByClassName('likes-675353')[0].getElementsByClassName('likes')[0].innerText = nblikes;
        }
      })
    });
  },
});

Template.home.helpers({
  movies() {
    return Template.instance().movies.get();
  }
});