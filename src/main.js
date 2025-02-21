import { capitalizeFirstLetter,  urlStatus} from "./util";

const results = document.querySelector('#results');
const apiStatus = document.querySelector('#api-status');
let input;

//calls the api to find the user entered name and filters
const submitButton = document.querySelector('#search-button').addEventListener('click', ()=>{
    input = document.querySelector('#search-text');
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

//checks the radio values to either true or false
const changeRadioValues = (name, value) => {
    let checkedBoxes = document.getElementsByName(name);
    for(let i in checkedBoxes){
        checkedBoxes[i].checked = false;
    }
}

//Resets the search
const resetButton = document.querySelector('#reset-button').addEventListener('click', ()=> {
    apiStatus.innerHTML = "Look up your favorite characters!";
    results.innerHTML ="";
    //input.innerHTML =" ";
    changeRadioValues('status-options');
    changeRadioValues('gender-options');
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
    return result;
}

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
        const response =  fetch(searchedURL);
        apiStatus.innerHTML = "Loading";
        url.then(response => { return response.json();})
        url.then(data => {
            console.log('Data recieved:', data);
        })
        .catch(error => {
            console.log('Error 404');
        });
        
        //calls a function to print it to the div
        results.innerHTML = "";
        urlStatus(json);
        printData(json);
        
    } catch (error){
        console.log(error.message);
    }
}

//parses json to divs to print it to html
//issue: currently shows upto 20 searches at once
function printData(json){
    let currentResults = json.results; //bug is here for reading code from next pages
    for(let index=0; index< currentResults.length; index++){
        let currentResult = currentResults[index];
        results.innerHTML += `<div class="character-results"><h2>${currentResult.name}</h2><img src="${currentResult.image}"><p>episodes appeared: ${currentResult.episode.length} <br>origin: ${currentResult.origin.name} <br>species: ${currentResult.species} <br>status: ${currentResult.status} </p></div>`
    }
}