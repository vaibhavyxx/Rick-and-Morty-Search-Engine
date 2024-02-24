"use strict";
            let displayTerm = "";
            let statusValue="";
            let genderValue = "";
            let userSearch="";
            window.onload = function(){
                init();
                updateSearchHistory();
            };
            const searchURL = "https://rickandmortyapi.com/api/character/";
            let page =1;
            let allCharacters=[];
            let parseCharacters= [];
            let body;
            let history = [];
            let nextButton= null;
            let prevButton = null;
            let reset;

            function init(){
                body = document.body;
                //getAllCharacters();
                document.querySelector("#search").onclick = getData;
                nextButton = document.querySelector("#next");
                reset = document.getElementById("reset");
                //calls data for the next page
                document.body.addEventListener('click', function(event){
                if(event.target.id == 'next'){
                    console.log("tried calling next page's data 1");
                    //getDataNextPage(obj.info.next);
                    if(obj != null && obj.info.next){
                        console.log(obj.info.next);
                        getDataNextPage(obj.info.next);
                    }
                    //ISSUE W REMOVING BUTTON WAS THAT THE NEXT SEARCH WILL NOT HAVE A NEXT BUTTON
                    /*if(obj.info.next == null){
                        let removeButton = document.querySelector("#next");
                        console.log("No next page");
                        body.removeChild(removeButton);
                    }*/
                }

                prevButton = document.querySelector("#prev");
                document.body.addEventListener('click', function(event){
                    if(event.target.id == 'prev'){
                        console.log("tried calling next page's data 1");
                        //getDataNextPage(obj.info.next);
                        if(obj != null && obj.info.next){
                            console.log(obj.info.next);
                            getDataNextPage(obj.info.next);
                        }
                        else{
                            console.log("No prev page");
                        }}
                })
               });
               loadSearchHistory();

               //follow a coursework
               //resets the page
               reset.addEventListener("click", function(e){

               });

            }
            let xhr;
            function getData(){

                let search = document.querySelector("#searchTerm");
                //takes values from search bar, gender and status
                displayTerm = document.querySelector("#searchTerm").value.toLowerCase();
                let status = document.querySelector("#statusOptions");
                let gender = document.querySelector("#genderOptions");
                statusValue = status.value;
                genderValue = gender.value;

                //parses user input to match the api words
                if(displayTerm != ""){
                    let words = displayTerm.split("");

                let firstLetter = words[0].toUpperCase();
                words[0] = firstLetter;
                let nextFirstLetter;
                for(let i=0; i< words.length; i++){
                    if(words[i] == " " && words[i+1] != null){
    
                        let nextIndex = i+1;
                        nextFirstLetter = words[nextIndex].toUpperCase();
                        words[nextIndex] = nextFirstLetter;
                    }
                }
                //console.log( "words array" +words);
                let term = words.join("");
                //console.log("parsed term: "+ term);
                displayTerm = term;
                }
                
                userSearch = searchURL + "?name=" +displayTerm;
                if(genderValue != "empty"){
                    userSearch += "&&gender="+ genderValue;
                }
                if(statusValue != "empty"){
                    userSearch += "&&status="+ statusValue;
                }

                console.log(userSearch+ "  : user search");
                document.querySelector("#success").innerHTML = `<span>Searching`;
                xhr = new XMLHttpRequest();
                xhr.onload = function(e){
                    dataLoaded(e, nextCreated);
                };
                xhr.onerror = dataError;                
                xhr.open("GET", userSearch);        
                xhr.send();
                //console.log(xhr.onload);
                localStorage.setItem('lastSearchTerm', displayTerm);
                saveSearchToHistroy(displayTerm);
            }        
        function dataError(e){
            document.getElementById("content").innerHTML = "No Results!";
		console.log("An error occurred");
	}

	let obj;
    let nextCreated = false;
    let prevCreated = false;

	function dataLoaded(e, isFirstPage){
        
		// 1 - e.target is the xhr object
		//let xhr1 = e.target;
        xhr = e.target;
		// 2 - xhr.responseText is the JSON file we just downloaded
		console.log(xhr.responseText);
	
		// 3 - turn the text into a parsable JavaScript object
		 obj = JSON.parse(xhr.responseText);
         
         //if no results, gives that info back to user
         if(obj.info == undefined){
            document.querySelector("#success").innerHTML = "<p>No Results</p>";
            document.querySelector("#content").innerHTML = "<p><i>Oops! No results, try something else.</i></p>";
            let removeButton = document.querySelector("#next");
            console.log("No next page");
            body.removeChild(removeButton);
			return; // Bail out
         }
        //console.log(obj);

        //if there is no next creates a next button and connects it to the url that user had wanted
        if(!nextCreated){
            if(obj.info.pages > 1){
                
                createButton("next");
                nextCreated= true;
                let nextSearch = obj.info.next;
                if(genderValue != "empty"){
                    nextCreated += "&&gender="+ genderValue;
                }
                if(statusValue != "empty"){
                    nextCreated += "&&status="+ statusValue;
                }
              
            }
            else{
                
            let removeButton = document.querySelector("#next");
            if (removeButton) {
            body.removeChild(removeButton);
            nextCreated = false;
            }

            }
        };

        if(obj.info.pages <1){
            createButton("prev");
            console.log("prev is created");           
            //document.getElementById("prev").onclick= prevPage(userSearch);
        }

		// 4 - if there are no results, print a message and return
		// Here, we don't get an array back, but instead a single object literal with 2 properties
		if(obj.name == "" || !obj.results){
			//document.querySelector("#content").innerHTML = "<p><i>Oops! No results, try something else.</i></p>";
			document.querySelector("#success").innerHTML = "<p><i>Oops! No results, try something else.</i></p>";
            return; // Bail out
		}
		
		//allows users to search characters name
        let results = obj.results.filter(function(e){
            if(e.name.includes(displayTerm.trim())){
                return (e.name.includes(displayTerm.trim()));
            }
        });

        document.querySelector("#success").innerHTML = `<span>${obj.info.count}</span> Results Found!`;
        document.querySelector("#content").innerHTML ="";

        //parses it for user to see it
		for(let i=0; i< results.length; i++){
			let result = results[i];

			//gets url for the Rick and Morty Page
			let image = result.image;
			if(!image) image = "";

			let url = result.url;
            let name = result.name;
            let status = result.status;
            let gender = result.gender;
			//Makes a div container so that user's can see it
			let line =  `<div class ='result'><img src= '${image}' title= '${result.id}'/>`;
            line += `<p><br><h3> ${name}</h3> <br><span>Status:  </span>${status} <br><span>Gender:  </span>${result.gender} <br><span>Species:</span> ${result.species} <br><span>Origin:</span> ${result.location.name}</p></div>`;
		    document.querySelector('#content').innerHTML += line;
            
		}
        updateSearchHistory();
	}

    //calls data for the next page
        function getDataNextPage(nextURL){
            console.log("getDataNext method: "+ nextURL);
                userSearch = nextURL;   //added this
                xhr = new XMLHttpRequest();
                xhr.onload = dataLoaded;
                xhr.onerror = dataError;
                xhr.open("GET", nextURL);    
                xhr.send();
                //console.log("next page is "+ nextURL);
                //console.log("nextURL: "+ userSearch);
        }

        //tried to make a function to call data for prev page
        function prevPage(prevURL){
            console.log("getDataNext method: "+ prevURL);
            xhr = new XMLHttpRequest();
            xhr.onload = dataLoaded;
            xhr.onerror = dataError;
            xhr.open("GET", prevURL);    
            xhr.send();
            //console.log("next page is "+ prevURL);
        }
//responsible for making buttons
    function createButton(name){
        let button = document.createElement('button');
        let controls = document.getElementById('controls');
        button.id = name;
        button.style.backgroundColor = "#725AC1";
        button.style.width="200px";
        button.style.height="50px";
        button.innerHTML = "Next";
        body.appendChild(button);
    }

    //user history to access it later
    function saveSearchToHistroy(searchTerm){
        history.push(searchTerm);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }

    //to show it back to the user
    function loadSearchHistory(){
        const savedHistory = localStorage.getItem('searchHistory');
        if(savedHistory){
            history = JSON.parse(savedHistory);
        }
    }

    //adds it to the search history and shows it to the user
    function updateSearchHistory(){
        const historyContainer = document.querySelector("#searchHistory");
        const searches = document.querySelector("#searchTerm");
        historyContainer.innerHTML = "<p>Search History: ";
        
        for(let i=0; i< history.length; i++){
            const termElement = document.createElement('p');
            termElement.textContent = history[i];
            historyContainer.innerHTML+= termElement.textContent +", ";
        }

        const lastSearchTerm = localStorage.getItem('lastSearchTerm');
        document.querySelector("#searchTerm").value = lastSearchTerm || '';
    }