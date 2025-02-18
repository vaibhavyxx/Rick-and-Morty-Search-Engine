const results = document.querySelector('#results');
const apiStatus = document.querySelector('#api-status');

//calls the api to find the user entered name and filters
const submitButton = document.querySelector('#search-button').addEventListener('click', ()=>{
    let input = document.querySelector('#search-text');
    let status = getCheckedValues("status-options");
    let gender = getCheckedValues('gender-options');
    let name = input.value.trim().toLowerCase();
    let nameArray = name.split(' ');

    //To start the names with uppercase if it is more than one word
    let fixed = "";
    for(let index in nameArray){
        fixed += `${capitalizeFirstLetter(nameArray[index])} `;
    }
    name = fixed.trim();
    getData(name, status, gender);
});

//gives checked values from multiple choices
function getCheckedValues(name){
    let checkedBoxes = document.getElementsByName(name);
    let result= [];
    for(let index =0; index < checkedBoxes.length; index++){
        if(checkedBoxes[index].checked){
            result.push(checkedBoxes[index].value);
        }
    }
   // console.log("filter result: "+ result);
    return result;
}

//capitalizes first letter
function capitalizeFirstLetter(word){
    return word.replace(/^./, char => char.toUpperCase());
};

//open the request to get the results for that item
//assuming user selects only one of the options
async function  getData(name, status, gender) {
    let searchedURL;
    const url="https://rickandmortyapi.com/api/character";
    if(name!= undefined){
        searchedURL = `${url}/?name=${name}`;
    }
    if(status.length >0){
        searchedURL+= `&&status=${status.pop()}`;
    }
    if(gender.length > 0){
        searchedURL += `&&gender=${gender.pop()}`;
    }
    
    try{
        const response = await fetch(searchedURL);
        apiStatus.innerHTML = "Loading";
        if(!response.ok){
            apiStatus.innerHTML = "Error";
            results.innerHTML = "Error 404. Try again";
            throw new Error(`Response Status: ${response.status}`);
        }
        const json = await response.json();
        //calls a function to print it to the div
        results.innerHTML = "";
        printData(json);
        if(json.info.count > 20){
           printData(json.info.next);
        }
        
    } catch (error){
        console.log(error.message);
    }
}

//parses json to divs to print it to html
//issue: currently shows upto 20 searches at once
function printData(json){
    let currentResults = json.results; //bug is here for reading code from next pages
    apiStatus.innerHTML = `Found ${json.info.count} searches`;
    //results.innerHTML = "";
    for(let index=0; index< currentResults.length; index++){
        let currentResult = currentResults[index];
        results.innerHTML += `<div class="character-results"><h2>${currentResult.name}</h2><img src="${currentResult.image}"><p>episodes appeared: ${currentResult.episode.length} <br>origin: ${currentResult.origin.name} <br>species: ${currentResult.species} <br>status: ${currentResult.status} </p></div>`
    }
}