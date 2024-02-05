const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {

    console.log('here');
    document.getElementById('resultsImageContainer').innerHTML = '';
    openResultsPane();

    let searchinput = document.querySelector('.search input').value; 
    if (searchinput.trim() === '') {
    console.log('Search term empty');
    return false; 
    } else {
    console.log('Search term:', searchinput);
    }
    let queryURL = `${bing_api_endpoint}?q=${encodeURIComponent(searchinput)}`;
    console.log('Query URL:', queryURL); // This will show the constructed URL in the console

    let request = new XMLHttpRequest();
    request.open('GET', queryURL, true);
    request.setRequestHeader('Ocp-Apim-Subscription-Key', bing_api_key);
    request.setRequestHeader('Accept', 'application/json');

    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status===200){
            let response = JSON.parse(this.responseText);
            console.log('Response:', response);
            let images = response.value;
            let suggestion = response.relatedSearches;
            displayRelated(suggestion);
            displayImages(images);
        }
    };
    request.send();
    return false;
}

function displayRelated(suggestions) {
    let suggestionsList = document.getElementById('suggested');
    suggestionsList.innerHTML = '';
    suggestions.slice(0,5).forEach(suggestion => {
        let suggestionElement = document.createElement('li');
        suggestionElement.textContent = suggestion.text;
        suggestionElement.addEventListener('click', function() {
            runSearchWithConcept(suggestion.text);
        });
        suggestionsList.appendChild(suggestionElement);
    });
}

function runSearchWithConcept(concept) {
    document.querySelector('.search input').value = concept; 
    runSearch(); 
}

function displayImages(images) {
    let container = document.getElementById('resultsImageContainer');
    images.slice(0,5).forEach(image => {
        let imgElement = document.createElement('img');
        imgElement.src = image.thumbnailUrl; /
        imgElement.alt = "Search result image";
        imgElement.addEventListener('click', function() {
            addToMoodBoard(image.contentUrl); 
        });

        container.appendChild(imgElement);
    });
}
function addToMoodBoard(imageUrl) {
    let board = document.getElementById('board');
    let imageContainer = document.createElement('div');
    imageContainer.className = 'savedImage';

    let imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = "Mood board image";

    imageContainer.appendChild(imgElement);
    board.appendChild(imgElement);
}


function openResultsPane() {
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  document.querySelector("#resultsExpander").classList.remove("open");
}

document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch();}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane();}
});
