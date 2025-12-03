import { createOrderedDeck, type Deck } from "./deck.js"
import { dealCards, sortHands } from "./hand.js"
import type { PlayerHand, PlayerHands } from "./hand.js"
import { shuffle, type ShuffleFunction } from "./shuffle.js"

// Some sort of histogram. Could be number of suits, number of ranks, etc.
export type HandDistributionSummary = Map<number, number>

const getNewHandDistributionSummary = (numberOfItems: number): HandDistributionSummary => new Map(Array.from({ length: numberOfItems + 1 }, (_, i) => [i, 0]))

export type HandSummarizationFunction = (params: {
  hands: PlayerHands;
  numberOfSuits: number;
  numberOfRanks: number;
}) => HandDistributionSummary

export type LabeledTest = {
  label: string;
  summary: HandDistributionSummary;
}

export type TestConfiguration = {
  numberOfSamples: number;
  numberOfPlayers: number;
  numberOfSuits: number;
  numberOfRanks: number;
  shufflingFunction: ShuffleFunction;
  shuffleCount: number;
  atATime?: number;
  handSummarizationFunction: HandSummarizationFunction;
  startingDeck?: Deck;
}

export const runTest = ({
  numberOfSamples = 1000,
  numberOfPlayers = 4,
  numberOfSuits = 4,
  numberOfRanks = 13,
  shufflingFunction,
  shuffleCount,
  atATime = 1,
  handSummarizationFunction,
  startingDeck = createOrderedDeck({ numberOfSuits, numberOfRanks }),
}: TestConfiguration): HandDistributionSummary => {
  const aggregateSummary = getNewHandDistributionSummary(numberOfRanks)

  for (let sampleIndex = 0; sampleIndex < numberOfSamples; sampleIndex++) {
    const summary = handSummarizationFunction({
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

export const summarizeHandSuitDistribution = (
  { hands, numberOfSuits, numberOfRanks }: {
    hands: PlayerHands;
    numberOfSuits: number;
    numberOfRanks: number;
  }): HandDistributionSummary => {
  const summary = getNewHandDistributionSummary(numberOfRanks)
  
  for (const hand of hands) {
    for (let suit = 0; suit < numberOfSuits; suit++) {
      const suitCount = hand.filter(card => card.suit === suit).length
      summary.set(suitCount, (summary.get(suitCount) ?? 0) + 1)
    }
  }

  return summary
}

const doesHandHaveSetOfSize = ({
  hand,
  setSize,
  numberOfRanks,
}: {
  hand: PlayerHand;
  setSize: number;
  numberOfRanks: number;
}): boolean => {
  const setSizes: Map<number, number> = new Map()

  for (let rank = 0; rank < numberOfRanks; rank++) {
    setSizes.set(rank, 0)
  }

  for (const card of hand) {
    setSizes.set(card.rank, (setSizes.get(card.rank) ?? 0) + 1)
  }

  for (const [, count] of setSizes.entries()) {
    if (count === setSize) {
      return true
    }
  }

  return false
}

export const summarizeHandSetDistribution = (
  { hands, numberOfSuits, numberOfRanks }: {
    hands: PlayerHands;
    numberOfSuits: number;
    numberOfRanks: number;
  }): HandDistributionSummary => {
  const summary = getNewHandDistributionSummary(numberOfSuits)

  for (const hand of hands) {
    for (let setSize = 0; setSize <= numberOfSuits; setSize++) {
      if (doesHandHaveSetOfSize({ hand, setSize, numberOfRanks })) {
        summary.set(setSize, (summary.get(setSize) ?? 0) + 1)
      }
    }
  }

  return summary
}
