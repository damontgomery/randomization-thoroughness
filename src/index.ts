import { createOrderedDeck } from "./deck.js"
import { dealCards, sortHands } from "./hand.js"
import { shuffle, shuffleRiffleWithAccuracyFunctionFactory, shuffleTrulyRandom } from "./shuffle.js"
import { runTest, summarizeHandSuitDistribution } from "./test.js"

// Deck composition
const numberOfSamples = 10000
const numberOfSuits = 4
const numberOfRanks = 13
const numberOfPlayers = 4
// Add a way to control accuracy of the riffle shuffle.
// A value of 1 means perfect interleaving, 0 means no interleaving.
const riffleAccuracy = 0.8
const atATime = 2

// Riffle Shuffle test.
// console.log('Starting Deck', createOrderedDeck({ numberOfSuits, numberOfRanks }))
// console.log('After 8 perfect riffle shuffles', shuffle({
//   deck: createOrderedDeck({ numberOfSuits, numberOfRanks }),
//   shufflingFunction: shuffleRiffleWithAccuracyFunctionFactory(1),
//   shuffleCount: 8,
// }))

// for (let accuracy = 1; accuracy >= 0; accuracy -= 0.1) {
//   riffleAccuracy = Math.round(accuracy * 10) / 10
//   console.log('')
//   printSummaryTable()
// }
