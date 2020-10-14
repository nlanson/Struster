#![feature(proc_macro_hygiene, decl_macro)]
#[macro_use] extern crate rocket;
#[macro_use] extern crate serde;

extern crate serde_json;
use serde::Serialize;
use rocket_contrib::json::Json;

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Anime {
    name: String,
    fid: String,
}


#[get("/")]
fn index() -> &'static str {
    "Go to http://localhost:8000/anime/<name> to search for an anime OP"
}

#[get("/anime/<search>")]
fn anime(mut search: String) -> Json<Anime> {
    let list = vec![
        Anime{name: String::from("jujutsu kaisen"), fid: String::from("rrGw8xRyk8fbWl7")},
        Anime{name: String::from("programming tutorial"), fid: String::from("ogV217MLlOtjOW")},
        Anime{name: String::from("nichijou"), fid: String::from("nichijou streaming key")}
        ];
   
   search.make_ascii_lowercase();
   println!("Search: {}", search);
   
   let mut i: usize = 0;
   let mut len: usize = list.len();
   len = len - 1; // to prevent panic at line 43
   
   let hit = loop {
       if list[i].name == search {
        println!("Found! at Vec Index {}", i);   
        break list[i].clone();
       } 

       if i >= len {
        println!("Not Found!");
        let na = Anime { name: String::from("Not Found"), fid: String::from("Unavailable") };
        break na
       }
       i = i + 1;
   };
   
   Json(hit)
}

fn main() {
    rocket::ignite().mount("/", routes![index, anime]).launch();
}