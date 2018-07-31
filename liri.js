var action = process.argv[2];
var value = process.argv[3];
var fs = require("fs");


require("dotenv").config();
var tools = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var nodeArgs = process.argv;


switch (action) {
    case "my-tweets":
      runTwitter();
      break;
    
    case "spotify-this-song":
      runSpotify();
      break;
    
    case "movie-this":
      runOMDB();
      break;
    
    case "do-what-it-says":
      readTextFile();
      break;

    default:
    console.log("unrecognized command");
        break;
    }


function runTwitter() {
    var client = new Twitter(tools.twitter);
    client.get('statuses/user_timeline', {count: 20}, function(error, tweets, response) {
        if(error) throw error;
        for (i=0; i<20; i++) {
            var j = 1;
            j = j + i;
            console.log("Tweet " + j + ": " + tweets[i].text);
        }
    });
}

function runSpotify() {

    var spot = new Spotify(tools.spotify);
    var songName = "";

    // Loop through all the words in the node argument
    // And do a little for-loop magic to handle the inclusion of "+"s
    if (nodeArgs.length == 3) {
        songName = "The Sign";
    }
    
    if (nodeArgs.length > 3) {
        for (var i = 3; i < nodeArgs.length; i++) {
            if (i > 3 && i < nodeArgs.length) {
            songName = songName + " " + nodeArgs[i];
            }
            else {
            songName += nodeArgs[i];
            }
        }
    }

    spot.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }


      console.log("Artist: " + data.tracks.items[0].artists[0].name); 
      console.log("Song Name: " + songName);
      console.log("Preview Link: " + data.tracks.items[0].external_urls.spotify); 
      console.log("Album: " + data.tracks.items[0].album.name); 

      });
}



function runOMDB() {

    var movieName = "";

    // Loop through all the words in the node argument
    // And do a little for-loop magic to handle the inclusion of "+"s
    if (nodeArgs.length == 3) {
        movieName = "Mr+Nobody";
    }
    
    if (nodeArgs.length > 3) {
        for (var i = 3; i < nodeArgs.length; i++) {
            if (i > 3 && i < nodeArgs.length) {
                movieName = movieName + "+" + nodeArgs[i];
            }
            else {
                movieName += nodeArgs[i];
            }
        }
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.    
    request(queryUrl, function(error, response, body) {
    
      // If the request is successful
      if (!error && response.statusCode === 200) {
    
        // Parse the body of the site and recover just the imdbRating
        // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).

      //  console.log("Release Year: " + body);


        console.log("Title: " + JSON.parse(body).Title);
        console.log("Release Year: " + JSON.parse(body).Year);
        console.log("imdb Rating: " + JSON.parse(body).imdbRating);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Country of Production: " + JSON.parse(body).Country);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
      }
    });

}

function readTextFile() {

    fs.readFile("random.txt", "utf8", function(error, data) {

        // replace initial nodeArgs with text content
        // loop through text to properly parse the text with spaces
        // run respective case loop again with text file instructed nodeArgs
      
        console.log(data);
      
      });

}
