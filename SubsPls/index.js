const https = require('https');
const Parser = require('rss-parser');
const parser = new Parser();
const fs = require('fs');
const WebTorrent = require('webtorrent');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
//const { exec } = require('child_process');
//const path = './shows.json';
//const shows = require(path);
//let rawdata = fs.readFileSync(path);
//let list = JSON.parse(rawdata);

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

//torrent(title, link);
getUploadLink("/dl/Jotaro.mp4", () => {console.log("fin");});

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
                console.log("File Renamed!"); 
            });
            torrent.destroy();
            client.destroy( function () {
                getUploadLink(newPath, () => {
                    console.log("This is the callback!!");
                });
            });
        });
        torrent.on('error', function (err) {
            console.log("Err: " + err);
        });
    });
}

async function getUploadLink(newPath, _callback) {
    console.log("getting link");
    let data = '';
    
    https.get("https://api.streamtape.com/file/ul?login=09c8392061b548eebd4e&key=Z1doL1Qjm6Fq9Yd&folder=DjOleF2OpRk" , (res) => {
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          data = JSON.parse(data);
          console.log(data.result.url);
          uploadVid(data.result.url, newPath, _callback);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}

function uploadVid(uploadUrl, vidPath, _callback) {
    var fullPath = __dirname + vidPath;
    var command = "curl -F data=@" + fullPath + " " + uploadUrl;
    commando(command);
    _callback();

}

async function commando(command) {
    try {
        await exec(command);
    } catch(err) { 
        console.error(err);
    };
};


