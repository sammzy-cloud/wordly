//Elements to be manipulated by DOM
const form = document.getElementById("dictionary-form");
const results = document.getElementById("result");
const wordInput = document.getElementById("word");
const savedWords = document.getElementById("saved-words");
const sourceLink = document.getElementById("source-link");
const wordTitle = document.getElementById("word-title");
const definition = document.getElementById("definition");
const example = document.getElementById("example");
const partOfSpeech = document.getElementById("part-of-speech");
const saveButton = document.getElementById("save-button");
const pronunctiation = document.getElementById("pronunciation")
const audioButton = document.getElementById("audio-button");
const synonymsList = document.getElementById("synonyms-list");
const favouriteButton = document.getElementById("favourite-button")
const favouritesList = document.getElementById("favourites-list");
const savedWordsLi = document.getElementById("saved-words-list");

//Variables to be initialized   
let currentWord = "";
let currentAudio = "";
let favourites = JSON.parse(localStorage.getItem("favourites"))|| [];
const savedWordsList = JSON.parse(localStorage.getItem("savedWords")) || [];
    
//Event Listeners
//1.Search
form.addEventListener("submit",function(event) {
    event.preventDefault();
    const word = wordInput.value;
    
    
    

    searchWord(word);
    wordInput.value ="";
});

//2.Save
saveButton.addEventListener("click", function(){
    
    if(!savedWordsList.includes(currentWord)){
        savedWordsList.push(currentWord);
        
    }
     localStorage.setItem(
        "savedWords",
        JSON.stringify(savedWordsList)
     );
    displaySavedWords();
    
});

//3.Favourite
favouriteButton.addEventListener("click", function () {
    addToFavourites(currentWord);
});
    displayFavourites();


//4.Audio
audioButton.addEventListener("click", function() {
    if (currentAudio) {
        const audio = new Audio(currentAudio);
        audio.play();

}

});

    

//API function
async function searchWord(word) {
    try {
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        const response = await fetch(url);
        if (!response.ok) {
        results.innerHTML = "<p>Word not found. Please try another word.</p>";
         return;
}

        const data = await response.json();

        
        displayResults(data);

    } catch (error) {
        console.log(error);
    }
}

//Display Functions

//1.Results
function displayResults(data) {
    const entry = data[0];
    currentWord = entry.word;
    currentAudio = "";   
    synonymsList.innerHTML = "";

    const audioObject = entry.phonetics.find(function(item) {
    return item.audio;
   });
   console.log(audioObject);

   if (audioObject) {
    currentAudio = audioObject.audio;
}
    
    wordTitle.textContent = entry.word;
    partOfSpeech.textContent = entry.meanings[0].partOfSpeech;
    definition.textContent = "Definition : " + entry.meanings[0].definitions[0].definition;
    example.textContent = "Example : " + (entry.meanings[0].definitions[0].example || "No example available.");
    pronunciation.textContent = "Pronunciation : " + (entry.phonetic || "Not available");  
    

    sourceLink.href = entry.sourceUrls[0];
    sourceLink.textContent = "View Source";
    entry.meanings[0].synonyms.forEach(function(synonym) {
    const synonymItems = document.createElement("li");
    synonymItems.textContent = synonym;
    synonymsList.appendChild(synonymItems);

    
});
}   

//2.Saved Words and deleting them
function displaySavedWords() {
    savedWordsLi.innerHTML = "";

    savedWordsList.forEach(function(word, index) {

        const listItem = document.createElement("li");
        listItem.textContent = word;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteSavedWord(index);
        });
        listItem.appendChild(deleteButton);
        savedWordsLi.appendChild(listItem);
});
function deleteSavedWord(index) {

    savedWordsList.splice(index, 1);

    localStorage.setItem(
        "savedWords",
        JSON.stringify(savedWordsList)
    );

    displaySavedWords();
}
}


//3.Favourite words and delete them
function displayFavourites() {

    favouritesList.innerHTML = "";

    favourites.forEach(function(word, index) {

        const li = document.createElement("li");

         

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






//Storage Functions
function addToFavourites(word) {
    if (!favourites.includes(word)) {
        favourites.push(word);

        localStorage.setItem(
            "favourites",
            JSON.stringify(favourites)
        );

        displayFavourites();
    }
}



displaySavedWords();
displayFavourites();