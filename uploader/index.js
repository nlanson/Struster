const https = require('https');
const fs = require('fs');
const path = './shows.json';
const shows = require(path);


main();

async function main() {
    console.log("Checking for shows to upload.")
    let today = new Date();
    let day = today.getDay();
    
    let rawdata = fs.readFileSync(path);
    let list = JSON.parse(rawdata);
    
    for(i=0; i<list.show_list.length; i++) {
        let urlId = list.show_list[i].url_id;
        let currEp = list.show_list[i].current_episode;
        if(currEp < 10) {
            currEpString = "0" + currEp.toString();
        } else {
            currEpString = currEp.toString();
        }

        let baseURL = "https://storage.googleapis.com/justawesome-183319.appspot.com/v2.4animu.me";
        let episodeURL = baseURL + "/" + urlId + "/" + urlId + "-Episode-" + currEpString +"-1080p.mp4";
        let uploadName = list.show_list[i].upload_name + " ep" + currEp.toString();
        let apiURL = "https://api.streamtape.com/remotedl/add?login=09c8392061b548eebd4e&key=Z1doL1Qjm6Fq9Yd&url=" + episodeURL +"&folder=DjOleF2OpRk&name=" + uploadName.toLowerCase();
        
        if(list.show_list[i].day == day){ //if the day is correct, then upload latest ep.
            console.log("Uploading " + uploadName);
            await sleep(5000);
            https.get(apiURL);
            console.log("Upload Complete");
            
            shows.show_list[i].current_episode = currEp + 1;
            fs.writeFile(path, JSON.stringify(shows, null, 2), function writeJSON(err) {
                if (err) return console.log(err);
                //console.log(JSON.stringify(shows));
                //console.log('writing to ' + path);
            });
        } //end upload
    } //end for
} //end main

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

