import { shuffleRiffleWithAccuracyFunctionFactory, shuffleTrulyRandom } from "../shuffle.js"
import { runTest, summarizeHandSetDistribution, type HandDistributionSummary, type LabeledTest } from "../test.js"
import { printTestsSummaryTable } from "../print.js";
import { createRankOrderedDeck } from "../deck.js";

// Deck composition
const numberOfSamples = 10000
const numberOfSuits = 4
const numberOfRanks = 13
const numberOfPlayers = 4
const atATime = 1

for (let accuracy = 1; accuracy >= 0.6; accuracy -= 0.1) {
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
      handSummarizationFunction: summarizeHandSetDistribution,
      startingDeck: createRankOrderedDeck({ numberOfSuits, numberOfRanks }),
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
        handSummarizationFunction: summarizeHandSetDistribution,
      }),
    })
  }

  console.log('\nPercent of hands with a set of size X  (over', numberOfSamples, 'samples):')

  printTestsSummaryTable({
    countLabel: 'Set Size',
    rows: numberOfSuits,
    numberOfObservations: numberOfSamples * numberOfPlayers,
    labeledTests: tests,
  })
}
