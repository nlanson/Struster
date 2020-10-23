const https = require('https');
const Parser = require('rss-parser');
const parser = new Parser();
const fs = require('fs');
const WebTorrent = require('webtorrent');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

//const path = './shows.json';
//const shows = require(path);
//let rawdata = fs.readFileSync(path);
//let list = JSON.parse(rawdata);

let link = new String;
let title = new String;


(async () => {
    let rssLink = "https://subsplease.org/rss/?t&r=720"; //nyaa URL
    let rssMagLink = "https://subsplease.org/rss/?r=720"; //magnet URL
    let feed = await parser.parseURL(rssLink);
    console.log(feed.title);

    feed.items.forEach(item => {
        var str_len = item.title.length -22;
        var lookingFor = "Higurashi no Naku Koro ni Gou - 03"       
        var pathTitle = item.title;
        item.title = item.title.slice(13, str_len);
        if(item.title == lookingFor){
            link = item.link;
            title = item.title;
            torrent(title, link, pathTitle);
        }
        
    });
})(); 



function torrent(title, link, pathTitle) {
    var client = new WebTorrent()
    var options = {
        path: "./dl" // Folder to download files to (default=`/tmp/webtorrent/`)
    };

    client.add(link, options, function (torrent) {
        console.log('Client is downloading:', torrent.infoHash);
        torrent.on('done', function () {
            console.log("Download finished");
            var oldPath = "/dl/" + pathTitle;
            var newPath = "/dl/" + title;
            fs.rename(oldPath, newPath, () => { 
                console.log("File Renamed!"); 
            }); //end rename
            torrent.destroy();
            client.destroy( function () {
                getUploadLink(newPath, () => {
                    fs.unlink(newPath, () => {
                        console.log("File was uploaded and deleted.")
                    });
                });
            }); //end client destroy
        });//end torrent.on done
        torrent.on('error', function (err) {
            console.log("Err: " + err);
        });//end torrent.error
    });//end add
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
          console.log("Streamtape Upload URL: " + data.result.url);
          uploadVid(data.result.url, newPath, _callback);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}

function uploadVid(uploadUrl, vidPath, _callback) {
    var fullPath = path.join(__dirname, vidPath);
    var command = "curl -F data=@" + fullPath + " " + uploadUrl;
    curl(command, _callback);

}

async function curl(command, _callback) {
    console.log(command);
    try {
        await exec(command);
    } catch(err) { 
        console.error(err);
    };
    _callback();
};

/*
To do: 
        Make program get torrent links of only selected shows and download, upload and delete the file once download is finished.

*/
