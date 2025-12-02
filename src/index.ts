// Deck composition
const numberOfSamples = 10000
const numberOfSuits = 4
const numberOfRanks = 13
const numberOfPlayers = 4

type Card = {
  suit: number
  rank: number
}

type Deck = Card[]

const createOrderedDeck = (): Deck => {
  const deck: Deck = []
  
  for (let suit = 0; suit < numberOfSuits; suit++) {
    for (let rank = 0; rank < numberOfRanks; rank++) {
      deck.push({ suit, rank })
    }
  }

  return deck
}

type ShuffleFunction = (deck: Deck) => Deck

const shuffleTrulyRandom: ShuffleFunction = (deck: Deck): Deck => deck.sort(() => Math.random() - 0.5)

const shuffleRiffleApproximation: ShuffleFunction = (deck: Deck): Deck => {
  const halfA = deck.slice(0, Math.floor(deck.length / 2));
  const halfB = deck.slice(Math.floor(deck.length / 2));

  for (let i = 0; i < deck.length; i++) {
    if (halfA.length === 0) {
      deck[i] = halfB.shift()!
      continue
    }

    if (halfB.length === 0) {
      deck[i] = halfA.shift()!
      continue
    }

    deck[i] = Math.random() < 0.5 ? halfA.shift()! : halfB.shift()!
  }

  return deck
}

type PlayerHand = Card[]
type PlayerHands = PlayerHand[]

const dealCards = (deck: Deck): PlayerHands => {
  const hands: PlayerHands = Array.from({ length: numberOfPlayers }, () => [])

  for (const [index, card] of deck.entries()) {
    hands[index % numberOfPlayers]!.push(card)
  }

  return hands
}

const sortHands = (hands: PlayerHands): PlayerHands => hands.map(hand => 
    hand.toSorted((a, b) => {
      if (a.suit !== b.suit) {
        return a.suit - b.suit
      }
      return a.rank - b.rank
    })
  )

const simulateShufflingAndDealing = (
  { shufflingFunction,
    shuffleCount,
  }: {
    shufflingFunction: ShuffleFunction;
    shuffleCount: number;
  }): PlayerHands => {
    let shuffledDeck: Deck = createOrderedDeck()

    for (let i = 0; i < shuffleCount; i++) {
      shuffledDeck = shufflingFunction(shuffledDeck)
    }
    
    return sortHands(dealCards(shuffledDeck))
}

type HandDistributionSummary = Map<number, number>

const summarizeHandDistribution = (hands: PlayerHands): HandDistributionSummary => {
  const summary: HandDistributionSummary = new Map(Array.from({ length: numberOfRanks + 1 }, (_, i) => [i, 0]))

  for (const hand of hands) {
    for (let suit = 0; suit < numberOfSuits; suit++) {
      const suitCount = hand.filter(card => card.suit === suit).length
      summary.set(suitCount, (summary.get(suitCount) ?? 0) + 1)
    }
  }

  return summary
}

const runTest = ({
  shufflingFunction,
  shuffleCount,
}: {
  shufflingFunction: ShuffleFunction;
  shuffleCount: number;
}): HandDistributionSummary => {
  const aggregateSummary: HandDistributionSummary = new Map(
    Array.from({ length: numberOfRanks + 1 }, (_, i) => [i, 0])
  )

  for (let sampleIndex = 0; sampleIndex < numberOfSamples; sampleIndex++) {
    const summary = summarizeHandDistribution(
      simulateShufflingAndDealing({
        shufflingFunction,
        shuffleCount,
      })
    )

    for (const [suitCount, count] of summary.entries()) {
      aggregateSummary.set(suitCount, (aggregateSummary.get(suitCount) ?? 0) + count)
    }
  }

  return aggregateSummary
}

const printSummaryTable = () => {
  const testResults = [
    {
      name: 'Random (1)',
      result: runTest({
        shufflingFunction: shuffleTrulyRandom,
        shuffleCount: 1,
      }),
    },
    {
      name: 'Riffle(1)',
      result: runTest({
        shufflingFunction: shuffleRiffleApproximation,
        shuffleCount: 1,
      }),
    },
    {
      name: 'Riffle(2)',
      result: runTest({
        shufflingFunction: shuffleRiffleApproximation,
        shuffleCount: 2,
      }),
    },
    {
      name: 'Riffle(3)',
      result: runTest({
        shufflingFunction: shuffleRiffleApproximation,
        shuffleCount: 3,
      }),
    },
    {
      name: 'Riffle(4)',
      result: runTest({
        shufflingFunction: shuffleRiffleApproximation,
        shuffleCount: 4,
      }),
    },
    {
      name: 'Riffle(5)',
      result: runTest({
        shufflingFunction: shuffleRiffleApproximation,
        shuffleCount: 5,
      }),
    },
    {
      name: 'Riffle(6)',
      result: runTest({
        shufflingFunction: shuffleRiffleApproximation,
        shuffleCount: 6,
      }),
    },
    {
      name: 'Riffle(7)',
      result: runTest({
        shufflingFunction: shuffleRiffleApproximation,
        shuffleCount: 7,
      }),
    },
  ]

  console.log('Suit Count Distribution Summary (over', numberOfSamples, 'samples):')
  console.log('Suit Count |', testResults.map(tr => tr.name.padStart(10)).join(' | '))
  console.log('-'.repeat(10 + testResults.length * 13))

  for (let suitCount = 0; suitCount <= numberOfRanks; suitCount++) {
    const row = [suitCount.toString().padStart(10)]
    for (const testResult of testResults) {
      row.push((testResult.result.get(suitCount) ?? 0).toString().padStart(10))
    }
    console.log(row.join(' | '))
  }
}

printSummaryTable()
