const Parser = require('rss-parser');
const parser = new Parser();
const fs = require('fs');
const WebTorrent = require('webtorrent');

let link = new String;
let title = new String;

/*  This code block gets titles and links from SubsPlease RSS Feed.
    It is disabled for development.
(async () => {
    let rssLink = "https://subsplease.org/rss/?t&r=720"; //nyaa URL
    let rssMagLink = "https://subsplease.org/rss/?r=720"; //magnet URL
    let feed = await parser.parseURL(rssLink);
    console.log(feed.title);

    feed.items.forEach(item => {
        var str_len = item.title.length -22;        
        item.title = item.title.slice(13, str_len);
        console.log(item.title);
        link = item.link;
    });
    console.log(link);
   
})(); 
*/

title = "[SubsPlease] Higurashi no Naku Koro ni Gou - 03 (720p) [1DEA5328].mkv";
link = "https://nyaa.si/view/1292504/torrent";


torrent(title, link);

function torrent(title, link) {
    var client = new WebTorrent()
    var opts = {
        path: "./dl" // Folder to download files to (default=`/tmp/webtorrent/`)
    };

    client.add(link, opts, function (torrent) {
        console.log('Client is downloading:', torrent.infoHash);
        torrent.on('done', function () {
            console.log("Download finished");
            var oldPath = "./dl/" + title;
            var newPath = "./dl/" + "newTitle.mkv";
            fs.rename(oldPath, newPath, () => { 
                console.log("\nFile Renamed!\n"); 
            });
            torrent.destroy();
            client.destroy();
        });
        torrent.on('error', function (err) {
            console.log("Err: " + err);
        })
    });
}
