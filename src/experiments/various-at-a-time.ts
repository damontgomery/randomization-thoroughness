import { shuffleRiffleWithAccuracyFunctionFactory, shuffleTrulyRandom } from "../shuffle.js"
import { runTest, summarizeHandSuitDistribution, type HandDistributionSummary, type LabeledTest } from "../test.js"
import { printTestsSummaryTable } from "../print.js";

// Deck composition
const numberOfSamples = 10000
const numberOfSuits = 4
const numberOfRanks = 13
const numberOfPlayers = 4
const riffleAccuracy = 0.8

for (let atATime = 1; atATime <= 4; atATime += 1) {
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
      label: `Deal ${atATime}, ${numberOfShuffles} shuffles`,
      summary: runTest({
        numberOfSamples,
        numberOfPlayers,
        numberOfSuits,
        numberOfRanks,
        shufflingFunction: shuffleRiffleWithAccuracyFunctionFactory(riffleAccuracy),
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
    labeledTests: tests,
  })
}