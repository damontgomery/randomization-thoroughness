import { createOrderedDeck, type Deck } from "./deck.js"
import { dealCards, sortHands } from "./hand.js"
import type { PlayerHands } from "./hand.js"
import { shuffle, type ShuffleFunction } from "./shuffle.js"

// Some sort of histogram. Could be number of suits, number of ranks, etc.
type HandDistributionSummary = Map<number, number>

export const summarizeHandSuitDistribution = (
  { hands, numberOfSuits, numberOfRanks }: {
    hands: PlayerHands;
    numberOfSuits: number;
    numberOfRanks: number;
}): HandDistributionSummary => {
  const summary: HandDistributionSummary = new Map(Array.from({ length: numberOfRanks + 1 }, (_, i) => [i, 0]))

  for (const hand of hands) {
    for (let suit = 0; suit < numberOfSuits; suit++) {
      const suitCount = hand.filter(card => card.suit === suit).length
      summary.set(suitCount, (summary.get(suitCount) ?? 0) + 1)
    }
  }

  return summary
}

export type TestConfiguration = {
  numberOfSamples: number;
  numberOfPlayers: number;
  numberOfSuits: number;
  numberOfRanks: number;
  shufflingFunction: ShuffleFunction;
  shuffleCount: number;
  atATime?: number;
}

export const runTest = ({
  numberOfSamples = 1000,
  numberOfPlayers = 4,
  numberOfSuits = 4,
  numberOfRanks = 13,
  shufflingFunction,
  shuffleCount,
  atATime = 1,
}: TestConfiguration): HandDistributionSummary => {
  const aggregateSummary: HandDistributionSummary = new Map(
    Array.from({ length: numberOfRanks + 1 }, (_, i) => [i, 0])
  )

  const startingDeck = createOrderedDeck({ numberOfSuits, numberOfRanks })

  for (let sampleIndex = 0; sampleIndex < numberOfSamples; sampleIndex++) {
    const summary = summarizeHandSuitDistribution({
      hands: sortHands(
        dealCards({
          deck: shuffle({
            deck: [...startingDeck],
            shufflingFunction,
            shuffleCount
          }),
          numberOfPlayers,
          atATime,
        })
      ),
      numberOfSuits,
      numberOfRanks,
    })

    for (const [suitCount, count] of summary.entries()) {
      aggregateSummary.set(suitCount, (aggregateSummary.get(suitCount) ?? 0) + count)
    }
  }

  return aggregateSummary
}
