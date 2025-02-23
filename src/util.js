//capitalizes first letter
function capitalizeFirstLetter(word){
    return word.replace(/^./, char => char.toUpperCase());
};

const urlStatus = (json) => {
    document.querySelector('#api-status').innerHTML = `Found ${json.info.count} searches`;
}

//checks the radio values to either true or false
const changeRadioValues = (name, value) => {
    let checkedBoxes = document.getElementsByName(name);
    for(let i in checkedBoxes){
        checkedBoxes[i].checked = false;
    }
}

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

export {capitalizeFirstLetter, urlStatus, changeRadioValues, getCheckedValues};