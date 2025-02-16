const results = document.querySelector('#results');
//make a function that trims and gives you value from the input text
//then, call the api with that name to see if it gives what you want

//As of now, assuming user only adds one name
const submitButton = document.querySelector('#search-button').addEventListener('click', ()=>{
    let input = document.querySelector('#search-text');
    let status = getCheckedValues("status-options");
    let gender = getCheckedValues('gender-options');
    let name = input.value;

    //status = document.querySelector('#status')
    let searched = input.value.trim();
    let fixed =  capitalizeFirstLetter(searched);
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
    //const checkedBoxes = document.querySelector(`input[name="${name}]:checked`);
    //const values = Array.from(checkedBoxes).map(checkbox => checkbox.value);
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
    if(status != undefined){
        searchedURL+= `&&status=${status.pop()}`;
    }
    if(gender != undefined){
        searchedURL += `&&gender=${gender.pop()}`;
    }
    try{
        const response = await fetch(searchedURL);
        if(!response.ok){
            throw new Error(`Response Status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json);
    } catch (error){
        console.log(error.message);
    }
}