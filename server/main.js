import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { Mongo } from 'meteor/mongo'
import { localDatas } from './local-datas.js'
import { ClientRequest, ServerResponse } from 'http';
import SimpleSchema from 'simpl-schema';
let keysJson = require('.keys.json');
const MovieDB = require('node-themoviedb');

const mdb = new MovieDB(keysJson.tmdb);

var moviesDB = new Mongo.Collection('movies');

Meteor.startup(() => {
  // code to run on server at startup
});

// Home page
Router.route('/api/movies/discover', async function () {
  //let moLi = moviesLikes;
  /** @type {ClientRequest} */
  var req = this.request;
  /** @type {ServerResponse} */
  var res = this.response;

  const movies = await mdb.discover.movie();
  movies.data.results.forEach(movie => {
    var mo = moviesDB.findOne({ movieId: movie.id, likes: {$gt: 0} });
    movie.likes=0;
    if(mo) movie.likes=mo.likes;
  });
  res.writeHead(200);
  res.end(JSON.stringify(movies.data));
}, {where: 'server'});

Router.route('/api/movies/like/add/:_id', function () {
  /** @type {ClientRequest} */
  var req = this.request;
  /** @type {ServerResponse} */
  var res = this.response;

  var params = this.params;
  var id = parseInt(params._id);

  // upsert is "create or update"
  var up = moviesDB.update({ movieId: id }, {$inc: { likes: 1 }},{ upsert: true });
  res.writeHead(200);
  res.end(JSON.stringify({success: (up==1?true:false)}));
}, {where: 'server'});

Router.route('/api/movies/comment/add/:_id', async function () {
  /** @type {ClientRequest} */
  var req = this.request;
  /** @type {ServerResponse} */
  var res = this.response;

  var params = this.params;
  var id = parseInt(params._id);

  var comment = req.body.comment;

  var commented = moviesDB.update({movieId: id}, {$push:{comments: { content: comment, createdAt: new Date() } }},{ upsert: true });

  res.writeHead(200);
  res.end(JSON.stringify({success: (commented==1?true:false)}));
},{where: 'server'});

// Movie page
Router.route('/api/movies/details/:_id', async function (request, response) {
  /** @type {ClientRequest} */
  var req = this.request;
  /** @type {ServerResponse} */
  var res = this.response;

  var params = this.params;
  var id = parseInt(params._id);

  var movie = await mdb.movie.getDetails({
    pathParameters: {
      movie_id: id,
    },
  });
  var commentsObj = moviesDB.findOne({ movieId: id });
  if(commentsObj) {
    movie.data.comments = commentsObj.comments;
  };

  res.writeHead(200);
  res.end(JSON.stringify(movie.data));
}, {where: 'server'});



//https://github.com/longshotlabs/simpl-schema#required
//http://iron-meteor.github.io/iron-router/#global-default-options
//https://developers.themoviedb.org/3/discover/movie-discover
//https://www.npmjs.com/package/node-themoviedb#common-usage-of-methods
//https://guide.meteor.com/collections.html#schemas
//file:///D:/EPSI/Cours%20Services%20Web/web-services-v2.pdf

//http://meteortips.com/second-meteor-tutorial
//https://forums.meteor.com/t/patterns-and-practices-for-passing-data-between-templates/2951/45
//https://stackoverflow.com/a/53338056