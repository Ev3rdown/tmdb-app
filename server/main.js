import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { Mongo } from 'meteor/mongo'
import { localDatas } from './local-datas.js'
import { ClientRequest, ServerResponse } from 'http';
import SimpleSchema from 'simpl-schema';
import url from 'url';
let keysJson = require('.keys.json');
const MovieDB = require('node-themoviedb');

const mdb = new MovieDB(keysJson.tmdb);

var moviesLikes = new Mongo.Collection('moviesLikes');


moviesLikes.schema = new SimpleSchema({
  movieId: {type: SimpleSchema.Integer, required: true},
  likes: {type: SimpleSchema.Integer, defaultValue: 0}
});

Meteor.startup(() => {
  // code to run on server at startup
});

async function getMovies() {
  let movies = await mdb.discover.movie();
  return movies;
}

Router.route('/api/movies/discover', async function () {
  //let moLi = moviesLikes;
  /** @type {ClientRequest} */
  var req = this.request;
  /** @type {ServerResponse} */
  var res = this.response;

  const movies = await mdb.discover.movie();
  console.log(movies);
  movies.data.results.forEach(movie => {
    var mo = moviesLikes.findOne({ movieId: movie.id });
    console.log(mo);
    if (mo) {
      movie.likes=mo.likes;
    } else {
      movie.likes=0;
    }
  });
  res.writeHead(200);
  res.end(JSON.stringify(movies.data));

}, {where: 'server'});

Router.route('/api/movies/like/:_id', async function () {
  /** @type {ClientRequest} */
  var req = this.request;
  /** @type {ServerResponse} */
  var res = this.response;

  var params = this.params; // { _id: "5" }
  var id = parseInt(params._id);

  var up = moviesLikes.update({ movieId: id }, {$inc: { likes: 1 }},{ upsert: true });
  var mo = moviesLikes.findOne({ movieId: id });
  console.log(mo);
  res.writeHead(200);
  res.end(JSON.stringify(mo));

}, {where: 'server'});
