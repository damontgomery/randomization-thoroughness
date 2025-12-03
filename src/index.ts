import { shuffleRiffleWithAccuracyFunctionFactory, shuffleTrulyRandom } from "./shuffle.js"
import { runTest, summarizeHandSuitDistribution, type HandDistributionSummary, type LabeledTest } from "./test.js"
import { printTestsSummaryTable } from "./print.js";

// Deck composition
const numberOfSamples = 10000
const numberOfSuits = 4
const numberOfRanks = 13
const numberOfPlayers = 4
const atATime = 1

// Riffle Shuffle test.
// console.log('Starting Deck', createOrderedDeck({ numberOfSuits, numberOfRanks }))
// console.log('After 8 perfect riffle shuffles', shuffle({
//   deck: createOrderedDeck({ numberOfSuits, numberOfRanks }),
//   shufflingFunction: shuffleRiffleWithAccuracyFunctionFactory(1),
//   shuffleCount: 8,
// }))

// Distribution of suits with various accuracies.

for (let accuracy = 1; accuracy >= 0; accuracy -= 0.1) {
  const roundedAccuracy = Math.round(accuracy * 10) / 10

  const tests: LabeledTest[]  = []

  // Add a truly random shuffle as a baseline.
  tests.push({
    label: `Random`,
    summary: runTest({
      numberOfSamples,
      numberOfPlayers,
      numberOfSuits,
      numberOfRanks,
      shufflingFunction: shuffleTrulyRandom,
      shuffleCount: 1,
      atATime,
      handSummarizationFunction: summarizeHandSuitDistribution,
    }),
  })

  for (let numberOfShuffles = 1; numberOfShuffles <= 8; numberOfShuffles++) {
    tests.push({
      label: `Riffle (${roundedAccuracy.toFixed(1)}) x ${numberOfShuffles}`,
      summary: runTest({
        numberOfSamples,
        numberOfPlayers,
        numberOfSuits,
        numberOfRanks,
        shufflingFunction: shuffleRiffleWithAccuracyFunctionFactory(roundedAccuracy),
        shuffleCount: numberOfShuffles,
        atATime,
        handSummarizationFunction: summarizeHandSuitDistribution,
      }),
    })
  }

  console.log('\nSuit Count Distribution Summary (over', numberOfSamples, 'samples):')

  printTestsSummaryTable({
    countLabel: 'Suit Count',
    rows: numberOfRanks,
    numberOfObservations: numberOfSamples * numberOfPlayers * numberOfSuits,
    labeledTests: tests,
  })
}
