let Parser = require('rss-parser');
let parser = new Parser();
let Client = require('node-torrent');
let client = new Client({logLevel: 'DEBUG'});
let fs = require('fs');



function torrent(link){
    var torrent = client.addTorrent(link);
    // when the torrent completes, move it's files to another area
    torrent.on('complete', function() {
        console.log('complete!');
        torrent.files.forEach(function(file) {
            var newPath = './dl' + file.path;
            fs.rename(file.path, newPath);
            // while still seeding need to make sure file.path points to the right place
            file.path = newPath;
        });
    });
}



(async () => {
    let rssLink = "https://subsplease.org/rss/?t&r=720"; //nyaa URL
    let rssMagLink = "https://subsplease.org/rss/?r=720"; //magnet URL
    let feed = await parser.parseURL(rssMagLink);
    console.log(feed.title);
   
    let link = new String;
    feed.items.forEach(item => {
        var str_len = item.title.length -22;        
        item.title = item.title.slice(13, str_len);
        console.log(item.title);
        link = item.link;
    });
    console.log(link);
    //torrent(link);
   
  })(); 
  