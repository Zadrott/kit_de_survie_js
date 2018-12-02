function callback() {
  console.log(allcharactersURLs);
  //   var test = new Set(allcharactersURLs);
  //   console.log(test);
  console.log(allCharactersName);
}
var allcharactersURLs = [];
var allCharactersName = [];

$(document).ready(function() {
  $.getJSON(
    "https://www.anapioficeandfire.com/api/books",
    function(books) {
      books.forEach(book => {
        var charactersURLs = book.characters;
        // console.log(charactersURLs.length); //total = 4656
        charactersURLs.forEach(url => {
          allcharactersURLs.push(url);
          $.getJSON(url, function(character) {
            if (character) {
              allCharactersName.push(character.name);
            }
            // $("#listResult").append("<li>" + character.name + " (" + character.gender + " " + character.culture + ")")
          });
        });
      });
    },
    callback()
  );
});
