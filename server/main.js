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
var moviesComments = new Mongo.Collection('moviesComments');


/* moviesLikes.schema = new SimpleSchema({
  movieId: {type: SimpleSchema.Integer, required: true},
  likes: {type: SimpleSchema.Integer, defaultValue: 0}
}); */

Meteor.startup(() => {
  // code to run on server at startup
});

Router.route('/api/movies/discover', async function () {
  //let moLi = moviesLikes;
  /** @type {ClientRequest} */
  var req = this.request;
  /** @type {ServerResponse} */
  var res = this.response;

  const movies = await mdb.discover.movie();
  console.log(movies.data.results);
  movies.data.results.forEach(movie => {
    var mo = moviesLikes.findOne({ movieId: movie.id });
    movie.likes=0;
    if(mo) movie.likes=mo.likes;
  });
  res.writeHead(200);
  res.end(JSON.stringify(movies.data));
}, {where: 'server'});

Router.route('/api/movies/like/:_id', function () {
  /** @type {ClientRequest} */
  var req = this.request;
  /** @type {ServerResponse} */
  var res = this.response;

  var params = this.params;
  var id = parseInt(params._id);

  var up = moviesLikes.update({ movieId: id }, {$inc: { likes: 1 }},{ upsert: true });
  res.writeHead(200);
  res.end(JSON.stringify({success: (up==1?true:false)}));
}, {where: 'server'});

Router.route('/api/movies/comment/:_id', function () {
  /** @type {ClientRequest} */
  var req = this.request;
  /** @type {ServerResponse} */
  var res = this.response;

  var params = this.params;
  var id = parseInt(params._id);

  var commented = moviesComment.insert({movieId: id, content: comment, createdAt: new Date() });
  res.writeHead(200);
  res.end(JSON.stringify({success: (commented==1?true:false)}));
}, {where: 'server'});


Router.route('/api/movies/details/:_id', async function () {
  /** @type {ClientRequest} */
  var req = this.request;
  /** @type {ServerResponse} */
  var res = this.response;

  var params = this.params;
  var id = parseInt(params._id);

  const movie = await mdb.movie.getDetails({
    pathParameters: {
      movie_id: id,
    },
  });

  res.writeHead(200);
  res.end(JSON.stringify(movie.data));
}, {where: 'server'});

//https://github.com/longshotlabs/simpl-schema#required
//http://iron-meteor.github.io/iron-router/#global-default-options
//https://developers.themoviedb.org/3/discover/movie-discover
//https://www.npmjs.com/package/node-themoviedb#common-usage-of-methods
//https://guide.meteor.com/collections.html#schemas
//file:///D:/EPSI/Cours%20Services%20Web/web-services-v2.pdf