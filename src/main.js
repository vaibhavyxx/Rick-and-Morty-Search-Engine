const results = document.querySelector('#results');

//make a function that trims and gives you value from the input text
//then, call the api with that name to see if it gives what you want


//gives you trimmed value of the input 
function getString(){
    const input = document.querySelector('#search-text');
    let searched = input.value().trim();
    let letters = searched.split(' ');
    //converts the first letter to capital
    letters[0] = letters[0].toUpperCase();
    let secondCapitalIndex = letters.indexOf(" ");
    letters[secondCapitalIndex + 1] = letters[secondCapitalIndex + 1].toUpperCase();
    return letters.toString();
}

//open the request to get the results for that item