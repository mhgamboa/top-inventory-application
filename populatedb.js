#! /usr/bin/env node

console.log(
  "This script populates some boardGames to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var BoardGame = require("./models/boardgame.js");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var boardGames = [];

function boardGameCreate(name, cb) {
  var boardGame = new BoardGame({ name: name });

  boardGame.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Board Game: " + boardGame);
    boardGames.push(boardGame);
    cb(null, boardGame);
  });
}

function createBoardGames(cb) {
  async.series(
    [
      function (callback) {
        boardGameCreate("Gloomhaven", callback);
      },
      function (callback) {
        boardGameCreate("Arkham Horror", callback);
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createBoardGames],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("BoardGames: " + BoardGame);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
