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
  // Pass the _id to the template
  this.state.set('movieId', this.params._id);
  this.render('movie');
});

// Template home page

Template.home.onCreated(function homeOnCreated() {
  let that = this;
  this.movies = new ReactiveVar();
  fetch('/api/movies/discover').then(res=>{
    res.json().then(json=>{
      that.movies.set(json.results);
    })
  });
});

Template.home.events({
  'click .like-button'(event, instance) {
    // increment the counter when button is clicked
    //instance.counter.set(instance.counter.get() + 1);
    let movieId = event.currentTarget.dataset.movieid
    fetch('/api/movies/like/add/'+movieId).then(res=>{
      res.json().then(json=>{
        if (json.success == true){
          var nblikes = (parseInt(document.getElementsByClassName('likes-'+movieId)[0].dataset.nblikes) + 1).toString();
          document.getElementsByClassName('likes-'+movieId)[0].dataset.nblikes = nblikes;
          document.getElementsByClassName('likes-'+movieId)[0].getElementsByClassName('likes')[0].innerText = nblikes;
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

// Template Movie

Template.movie.onCreated(function helloOnCreated() {
  // Get id as set on line 19
  var id = Iron.controller().state.get('movieId');

  let that = this;
  this.movie = new ReactiveVar(0);

  fetch('/api/movies/details/'+id).then(res=>{
    res.json().then(json=>{
      that.movie.set(json);
    })
  });
});

Template.movie.helpers({
  movie() {
    return Template.instance().movie.get();
  }
});

// Template comment

Template.addMovieComment.events({
  'submit form': function(event,instance){
    event.preventDefault();
    form = document.getElementById('addMovieComment');
    var comment = event.currentTarget.comment.value;
    // Forced to use JSON as Iron Router doesn't support FormData format (html standard)
    fetch('/api/movies/comment/add/'+form.dataset.movieid,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"comment": comment})
    })
    .then(res=>{
      res.json().then(json=>{
        // On sucess, refresh the data to include the newly added comment
        if (json.success==true) {
          // Need to specify the instance to use, as movie data is in movie and we are here in addMovieComment
          movie = Blaze.getView(document.getElementById('movieDetails')).templateInstance().movie.get();
          fetch('/api/movies/details/'+movie.id).then(res=>{
            res.json().then(json=>{
              Blaze.getView(document.getElementById('movieDetails')).templateInstance().movie.set(json);
            })
          }).catch((reason)=>{
            console.log(reason);
            alert("Error when saving the comment");
          });
        }else{
          alert("Error when saving the comment");
        }
      });
    });
  }
});