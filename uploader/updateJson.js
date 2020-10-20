const fs = require('fs');
const { start } = require('repl');
const path = './shows.json';
const shows = require(path);
const prompt = require('prompt-sync')();

let list = fs.readFileSync("shows.json","utf-8");
list = JSON.parse(list);

startcli();

function startcli() {
    let action = new String;
    let contin = false;
    while( contin != true ) {
        action = prompt("Input option: (add/rm/cancel): ");
        switch( action ) {
            case "add":
                contin = true;
                Add();
                break;
            case "rm":
                contin = true;    
                Remove();
                break;
            case "cancel":
                contin = true;
                break;
            default:
                console.log("Invalid option.");
                break;
        }//end switch
    }//end while
}//end start

function Add() {
    let upload_name = new String;
    let url_id = new String;
    let day = new Number;
    let current_episode = new Number;
    
    upload_name = prompt('Show name (to use for uploads): ');
    url_id = prompt('URL id to fetch each episode: ');
    link_v = prompt('CloudAPI version? (Legacy not configured. Options: 6/2)')
    day = prompt('What day of the week to fetch show?');
    current_episode = prompt('What is the next airing episode? (Default = 1): ');

    if( upload_name == "" || url_id == "" || day == "" ) {
        console.log("Cannot process. Not enough information.")
    } else {
        if( day > 6 || day < 0 ) {
            console.log("Invalid Date");
        } else {
            if( current_episode == "" || current_episode == null ) {
                current_episode = 1;
            }
            let new_show = {
                "upload_name": upload_name,
                "url_id": url_id,
                "day": day,
                "current_episode": current_episode,
                "link_v": link_v
            };
            
            list.show_list.push(new_show);
            list = JSON.stringify(list, null, 2);
            fs.writeFileSync("shows.json",list,"utf-8");
            console.log(new_show);
        }
    }
}

function Remove() {
    console.log("\n");
    console.log("Shows scheduled for upload: ");
    console.log("----------------------------");
    for( i=0; i<list.show_list.length; i++ ) {
        console.log(list.show_list[i].upload_name + " (next ep " + list.show_list[i].current_episode);
    }
    console.log("----------------------------");
    let toRemove = prompt('Enter show remove from above (Copy Case): ');
    let removed = false;

    for( i=0; i<list.show_list.length; i++ ) {
        if(list.show_list[i].upload_name == toRemove){
            list.show_list.splice(i, 1);
            removed = true;
        }
    }

    if( removed == true ) {
        console.log("Removing...")
        list = JSON.stringify(list, null, 2);
        fs.writeFileSync("shows.json",list,"utf-8");
        console.log("Successfully Removed.")
    } else {
        console.log("Failed to remove. Show not found.")
    }
}




