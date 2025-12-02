// Deck composition
const numberOfSamples = 10000
const numberOfSuits = 4
const numberOfRanks = 13
const numberOfPlayers = 4
// Add a way to control accuracy of the riffle shuffle.
// A value of 1 means perfect interleaving, 0 means no interleaving.
let riffleAccuracy = 0.8

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

const shuffleRiffleApproximationWithAccuracy: ShuffleFunction = (deck): Deck => {
  const halfA = deck.slice(0, Math.floor(deck.length / 2));
  const halfB = deck.slice(Math.floor(deck.length / 2));

  // If you simulate a perfect riffle shuffle, you should return the deck after 8 shuffles. Starting with A seems to work.
  let shouldTakeFromA = true

  for (let i = 0; i < deck.length; i++) {
    if (halfA.length === 0) {
      deck[i] = halfB.shift()!
      continue
    }

    if (halfB.length === 0) {
      deck[i] = halfA.shift()!
      continue
    }

    deck[i] = shouldTakeFromA ? halfA.shift()! : halfB.shift()!

    if (Math.random() < riffleAccuracy) {
      shouldTakeFromA = !shouldTakeFromA
    }
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

const shuffle = (
  { shufflingFunction,
    shuffleCount,
  }: {
    shufflingFunction: ShuffleFunction;
    shuffleCount: number;
  }): Deck => {
    let shuffledDeck: Deck = createOrderedDeck()

    for (let i = 0; i < shuffleCount; i++) {
      shuffledDeck = shufflingFunction(shuffledDeck)
    }

    return shuffledDeck
  }

// console.log('Starting Deck', createOrderedDeck())
// console.log('After 8 riffle shuffles (accuracy', riffleAccuracy, ')', shuffle({
//   shufflingFunction: shuffleRiffleApproximationWithAccuracy,
//   shuffleCount: 8,
// }))

const simulateShufflingAndDealing = (
  { shufflingFunction,
    shuffleCount,
  }: {
    shufflingFunction: ShuffleFunction;
    shuffleCount: number;
  }): PlayerHands => sortHands(dealCards(shuffle({ shufflingFunction, shuffleCount })))

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
    }
  ]

  // for (let i = 1; i <= 7; i++) {
  //   testResults.push(
  //     {
  //       name: `Riffle (${i})`,
  //       result: runTest({
  //         shufflingFunction: shuffleRiffleApproximation,
  //         shuffleCount: i,
  //       }),
  //     }
  //   )
  // }

  for (let i = 1; i <= 8; i++) {
    testResults.push(
      {
        name: `Riffle (${i})`,
        result: runTest({
          shufflingFunction: shuffleRiffleApproximationWithAccuracy,
          shuffleCount: i,
        }),
      }
    )
  }

  const columnWidth = 10

  console.log('Suit Count Distribution Summary (over', numberOfSamples, 'samples with', riffleAccuracy, 'accuracy):')
  console.log('Suit Count |', testResults.map(tr => tr.name.padStart(columnWidth)).join(' | '))
  console.log('-'.repeat(10 + testResults.length * (columnWidth + 3)))

  for (let suitCount = 0; suitCount <= numberOfRanks; suitCount++) {
    const row = [suitCount.toString().padStart(10)]
    for (const testResult of testResults) {
      const totalHands = numberOfPlayers * numberOfSuits * numberOfSamples
      const percent = (testResult.result.get(suitCount) ?? 0) / totalHands * 100
      row.push(percent.toFixed(2).padStart(columnWidth))
    }
    console.log(row.join(' | '))
  }
}

for (let accuracy = 1; accuracy >= 0; accuracy -= 0.1) {
  riffleAccuracy = Math.round(accuracy * 10) / 10
  console.log('')
  printSummaryTable()
}
