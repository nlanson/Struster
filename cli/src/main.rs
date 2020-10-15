extern crate reqwest;
use text_io::read;
use serde::{Serialize, Deserialize}; //serde is used to convert json into structs and vice versa

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    println!("Search anime:");
    let anime: String = read!();
    let api_address: String = format!("http://localhost:8000/anime/", anime);
    let client = reqwest::Client::new();
    let api_res = client.get(&api_address).send().await?;
    let  res = api_res.text().await?;

    let status: Status = serde_json::from_str(&res).unwrap(); //convert res_stat (L18) to Struct Status (L5)

    

    Ok(())


}
