import { capitalizeFirstLetter, urlStatus, changeRadioValues, getCheckedValues} from "./util.js";

const results = document.querySelector('#results');
const apiStatus = document.querySelector('#api-status');
let input;

//buttons to ensure that you can see them only when the page allows
//const prevButton = document.querySelector('#prev-button');
const moreButton = document.querySelector('#more-button');

init();

//hides buttons
function init(){
    //prevButton.style.display = 'none';
    moreButton.style.display = 'none';
}

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

//Resets the search
const resetButton = document.querySelector('#reset-button').addEventListener('click', ()=> {
    apiStatus.innerHTML = "Look up your favorite characters!";
    results.innerHTML ="";
    changeRadioValues('status-options');
    changeRadioValues('gender-options'); 
});


//open the request to get the results for that item
//assuming user selects only one of the options
async function  getData(name, status, gender) {
    let searchedURL;
    apiStatus.innerHTML = "Loading";
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
        console.log(searchedURL);
        fetch(searchedURL)
            .then(response => { return response.json();})
            .then(data => {
                console.log('Data recieved:', data);
                results.innerHTML = "";
                urlStatus(data);
                printData(data);
                displayButtons(data);
        })
        .catch(error => {
            console.log('Error 404');
        });
    } catch (error){
        console.log(error.message);
    }
}

//parses json to divs to print it to html
//issue: currently shows upto 20 searches at once
function printData(data){
    let currentResults = data.results; //bug is here for reading code from next pages
    for(let index=0; index< currentResults.length; index++){
        let currentResult = currentResults[index];
        results.innerHTML += `<div class="character-results"><h2>${currentResult.name}</h2><img src="${currentResult.image}"><p>episodes appeared: ${currentResult.episode.length} <br>origin: ${currentResult.origin.name} <br>species: ${currentResult.species} <br>status: ${currentResult.status} </p></div>`
    }
}

//if next and previous api calls are available, display buttons
function displayButtons(data){
    if(data.info.next != null){
        moreButton.style.display = 'block';
        moreButton.addEventListener('click', ()=>{
            fetch(data.info.next)
                .then(response => response.json())
                .then(nextPageData => {
                    printData(nextPageData);
                    displayButtons(nextPageData);
                })
                .catch(error => {
                    console.log('error loading next page', error);
                });
        });
    }
}
