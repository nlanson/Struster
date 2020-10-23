const https = require('https');
const Parser = require('rss-parser');
const parser = new Parser();
const fs = require('fs');
const WebTorrent = require('webtorrent');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

const jsonPath = './shows.json';
const shows = require(jsonPath);
let rawdata = fs.readFileSync(jsonPath);
let list = JSON.parse(rawdata);

let link = new String;
let title = new String;


(async () => {
    let rssLink = "https://subsplease.org/rss/?t&r=720"; //nyaa URL
    let rssMagLink = "https://subsplease.org/rss/?r=720"; //magnet URL
    let feed = await parser.parseURL(rssLink);
    console.log(feed.title);
    var today = new Date();
    var day = today.getDay();

    feed.items.forEach(item => {
        var str_len = item.title.length -22;    
        var pathTitle = item.title;
        item.title = item.title.slice(13, str_len);
        let i = 0;
        let found = false;
        while( i < list.showsArray.length && found != true ) {
            var toUp = list.showsArray[i].toUp.toString();
            if( toUp < 10 ) {
                toUp = "0" + toUp.toString();
            }
            let lookingFor = list.showsArray[i].name + " - " + toUp;
            //console.log(lookingFor + " : " + item.title);
            
            if( lookingFor == item.title && shows.showsArray[i].day == day ){
                found == true;
                link = item.link;
                title = item.title;
                title = title.replace(/\s/g, '-');
                
                list.showsArray[i].toUp = list.showsArray[i].toUp + 1;
                fs.writeFile(jsonPath, JSON.stringify(list, null, 2), function writeJSON(err) {
                    if (err) return console.log(err);
                });
                
                torrent(title, link, pathTitle)
            }
            i++;
        }
    });
})(); 


function torrent(title, link, pathTitle) {
    var client = new WebTorrent()
    var options = {
        path: "/media/nlanson/ndrive/upload/" // Folder to download files to (default=`/tmp/webtorrent/`)
    };

    client.add(link, options, function (torrent) {
        console.log('Client is downloading:', torrent.infoHash);
        torrent.on('done', function () {
            console.log("Download finished");
            var oldPath = options.path + pathTitle;
            var newPath = options.path + title;
            fs.rename(oldPath, newPath, () => { 
                console.log("File Renamed!"); 
            }); //end rename
            torrent.destroy();
            client.destroy( function () {
                getUploadLink(newPath, () => {
                    fs.unlink(newPath, () => {
                        console.log("Video has been uploaded and deleted.");
                    });
                });
            }); //end client destroy
        });//end torrent.on done
        torrent.on('error', function (err) {
            console.log("Err: " + err);
        });//end torrent.error
    });//end add
    client.on('error', function (err) {
        console.log(err);
        client.destroy();
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
          console.log("Streamtape Upload URL: " + data.result.url);
          uploadVid(data.result.url, newPath, _callback);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}

function uploadVid(uploadUrl, vidPath, _callback) {
    var command = "curl -F data=@" + vidPath + " " + uploadUrl;
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

