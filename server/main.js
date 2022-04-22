import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { localDatas } from './local-datas.js'
import { ClientRequest, ServerResponse } from 'http';
import url from 'url';
let keysJson = require('.keys.json');
const MovieDB = require('node-themoviedb');

const mdb = new MovieDB(keysJson.tmdb);


Meteor.startup(() => {
  // code to run on server at startup
});

WebApp.connectHandlers.use('/api/discover/movie', (req, res, next) => {
  res.writeHead(200);
  res.end(JSON.stringify(localDatas));
});

/* WebApp.connectHandlers.use('/api/like/movie', (req, res, next) => {
  console.log(req.url);
  let queryParams = url.parse(req.url,false).query;
  // On retire les query params de l'url
  let urlWithoutQueryParams = req.url.split('?')[0];
  let id = urlWithoutQueryParams.split("/")[1];
  console.log((id.length>0?id:"errored id"));
  res.writeHead(200);
  res.end("Liked movie "+ (id.length>0?id:"errored id"));
}); */

Router.route('/api/movies/discover', async function () {
  /** @type {ClientRequest} */
  var req = this.request;
  /** @type {ServerResponse} */
  var res = this.response;

  const movie = await mdb.discover.movie();
  res.writeHead(200);
  res.end(JSON.stringify(movie.data));

}, {where: 'server'});

Router.route('/api/movies/like/:_id', async function () {
  /** @type {ClientRequest} */
  var req = this.request;
  /** @type {ServerResponse} */
  var res = this.response;

  var params = this.params; // { _id: "5" }
  var id = params._id;

  res.writeHead(200);
  res.end(JSON.stringify({"liked":id}));

}, {where: 'server'});
