import {sample} from "./sample";

class StoryJumper {
  constructor(sampleText) {
    this.story = sampleText.split(/ |\n\n/);
  }

  _strip(word) {
    return word.replace(/\,|\.|\’|\”|\“/, "");
  }

  _placesOf(word) {
    const wordIndices = this.story.reduce((is, w, i) => {
      // Splitting leaves commas, period, smart apostrophes, and smart quotes
      // intact. To compare to the search term `word`, first strip comparing
      // story word and lower case each.
      const wordIndicesAccumulator =
        this._strip(w).toLowerCase() === word.toLowerCase()
          ? is.concat([i])
          : is;
      return wordIndicesAccumulator;
    }, Array());
    return wordIndices;
  }

  *generator(wordTotal, noJumpBeforeTimes = 5, jumpProbability = 0.75) {
    let wordsSoFar = 0;
    let place = 0;
    let wordsSinceLastMovement = 0;

    while (wordsSoFar < wordTotal) {
      yield this.story[place];
      place++;
      wordsSinceLastMovement++;
      wordsSoFar++;

      if (place >= this.story.length) {
        place = Math.floor(Math.random() * this.story.length);
      }

      if (
        wordsSinceLastMovement > noJumpBeforeTimes &&
        this._placesOf(this.story[place]).length > 2 &&
        Math.random() > jumpProbability
      ) {
        let currentWord = this._strip(this.story[place]);
        let otherWordPlaces = this._placesOf(currentWord).filter(
          p => p !== place
        );

        place =
          otherWordPlaces[Math.floor(Math.random() * otherWordPlaces.length)];

        wordsSinceLastMovement = 0;
      }
    }
  }
}

const story = new StoryJumper(sample);

let storyGenerator = story.generator(50);
console.log([...storyGenerator].join(" "));
