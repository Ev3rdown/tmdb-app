import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { localDatas } from './local-datas.js'
import url from 'url';

Meteor.startup(() => {
  // code to run on server at startup
});

WebApp.connectHandlers.use('/api/discover/movie', (req, res, next) => {
  res.writeHead(200);
  res.end(JSON.stringify(localDatas));
});

WebApp.connectHandlers.use('/api/like/movie', (req, res, next) => {
  console.log(req.url);
  let queryParams = url.parse(req.url,false).query; // { monQueryParam: 'maValeur' }
  // On retire les query params de l'url
  let urlWithoutQueryParams = req.url.split('?')[0];
  let id = urlWithoutQueryParams.split("/")[1];
  console.log((id.length>0?id:"errored id"));
  res.writeHead(200);
  res.end("Liked movie "+ (id.length>0?id:"errored id"));
});
/*
WebApp.connectHandlers.use('/api/like', (req, res, next) => {
  console.log(req);
  res.writeHead(200);
  res.end(JSON.stringify(localDatas));
});
*/
