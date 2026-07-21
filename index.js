//Elements to be manipulated by DOM
const form = document.getElementById("dictionary-form");
const results = document.getElementById("result");
const wordInput = document.getElementById("word");
const sourceLink = document.getElementById("source-link");
const wordTitle = document.getElementById("word-title");
const definition = document.getElementById("definition");
const example = document.getElementById("example");
const partOfSpeech = document.getElementById("part-of-speech");
const pronunciation = document.getElementById("pronunciation")
const audioButton = document.getElementById("audio-button");
const synonymsList = document.getElementById("synonyms-list");
const favouriteButton = document.getElementById("favourite-button")
const favouritesList = document.getElementById("favourites-list");
const searchButton = document.getElementById("search-button");
const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");
const favouritesSection = document.getElementById("favourites");
const sourceContainer = document.getElementById("source-container");


//Variables to be initialized   
let currentWord = "";
let currentAudio = "";
let favourites = JSON.parse(localStorage.getItem("favourites"))|| [];
audioButton.disabled = true;  
favouriteButton.disabled = true;


//Event Listeners

//1.Search
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const word = wordInput.value.trim();

    if (word === "") {
        errorMessage.textContent = "Please enter a word.";
        return;
    }

    await searchWord(word);
    wordInput.value = "";
});

//2.Favourite
favouriteButton.addEventListener("click", function () {

    if(currentWord === ""){
        alert("Search for a word first.");
        return;
    }

    addToFavourites(currentWord);
});

displayFavourites();

//3.Audio
audioButton.addEventListener("click", function () {

    if (currentAudio) {

        const audio = new Audio(currentAudio);
        audio.play();
    }

});

    
//API function
async function searchWord(word) {
    clearResults();
    searchButton.disabled = true;
    loadingMessage.textContent = `Searching for "${word}"...`;
    errorMessage.textContent = "";
    try {
        
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

        
        const response = await fetch(url);
        if (!response.ok) {
            clearResults();
            results.style.display = "block";
            if(favourites.length>0){
             favouritesSection.style.display = "block";
            }

            errorMessage.textContent = "Word not found. Please try another word.";
            return;
        }
        
    
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            clearResults();
            results.style.display = "block";
            errorMessage.textContent = "Word not found. Please try another word.";
            return;
        }

        displayResults(data);
        

    } catch (error) {
        clearResults();
        errorMessage.textContent =
        "Unable to connect. Please check your internet connection.";
    }
    finally{
        loadingMessage.textContent = "";
        searchButton.disabled = false;
    }
    
}

//Display Functions

//1.Results
function displayResults(data) {
    errorMessage.textContent = "";
    results.style.display = "block";
    favouritesSection.style.display = "block";
    sourceContainer.style.display = "block";
    
    const entry = data[0];
    currentWord = entry.word;
    favouriteButton.disabled = false;   
    synonymsList.innerHTML = "";

    const audioObject = entry.phonetics?.find(function(item) {
    return item.audio;
    });
   

   if (audioObject) {

        currentAudio = audioObject.audio;
        audioButton.disabled = false;

    } 
    else {

        currentAudio = "";
        audioButton.disabled = true;

    }
    
    wordTitle.textContent = entry.word;
    partOfSpeech.textContent = entry.meanings?.[0]?.partOfSpeech || "Not available";
    definition.textContent = "Definition : " + (entry.meanings?.[0]?.definitions[0]?.definition || "Definition unavailable")
    example.textContent = "Example : " + (entry.meanings?.[0]?.definitions[0]?.example || "No example available.");
    pronunciation.textContent = "Pronunciation : " + (entry.phonetic || "Not available");  
    

    if (entry.sourceUrls && entry.sourceUrls.length > 0) {
        sourceLink.href = entry.sourceUrls[0];
        sourceLink.textContent = "View Source";
    } 
    else {
        sourceLink.removeAttribute("href");
        sourceLink.textContent = "No source available";
    }
    
    const synonyms = entry.meanings?.[0]?.synonyms || [];

    if (synonyms.length === 0) {

        const li = document.createElement("li");
        li.textContent = "No synonyms available.";
        synonymsList.appendChild(li);

    } 
    else {
        synonyms.forEach(function(synonym){

            const li = document.createElement("li");
            li.textContent = synonym;
            synonymsList.appendChild(li);

        });

    }
   
};
   
//2.Favourite words and delete them
function displayFavourites() {

    favouritesList.innerHTML = "";
    if(favourites.length===0){
        favouritesList.innerHTML= "<li>No favourite words yet.</li>";
        return;
    }
    
    favourites.forEach(function(word, index) {
        const li = document.createElement("li");

        const wordSpan = document.createElement("span");
        wordSpan.textContent = word;
        wordSpan.style.cursor = "pointer";

        wordSpan.addEventListener("click", function () {
          wordInput.value = word;
          searchWord(word);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";


        deleteButton.addEventListener("click", function () {
          deleteFavourite(index); 
        });

        li.appendChild(wordSpan);
        li.appendChild(deleteButton);
        favouritesList.appendChild(li);
    });
   
}


function deleteFavourite(index) {

    favourites.splice(index, 1);

    localStorage.setItem(
        "favourites",
        JSON.stringify(favourites)
    );

    displayFavourites();
}

//Clear results function
function clearResults() {
    errorMessage.textContent = "";

    wordTitle.textContent = "";
    pronunciation.textContent = "";
    partOfSpeech.textContent = "";
    definition.textContent = "";
    example.textContent = "";
    synonymsList.innerHTML = "";

    sourceLink.textContent = "";
    sourceLink.removeAttribute("href");

    currentWord = "";
    currentAudio = "";
    audioButton.disabled = true;
    favouriteButton.disabled= true;
    sourceContainer.style.display = "none";
    
}

//Storage Functions
function addToFavourites(word){

    if(
     favourites.some(function(item){

        return item.toLowerCase()===word.toLowerCase();
      })
    ) {
       alert("This word is already in your favourites.");
        return;

    }

    favourites.push(word);

    localStorage.setItem(
        "favourites",
        JSON.stringify(favourites)
    );

    
    displayFavourites();
}

displayFavourites();