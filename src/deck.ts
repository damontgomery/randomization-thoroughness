export type Card = {
  suit: number
  rank: number
}

export type Deck = Card[]

// @todo support decks with duplicate cards?
export const createOrderedDeck = ({
  numberOfSuits,
  numberOfRanks,
}: {
  numberOfSuits: number
  numberOfRanks: number
}): Deck => {
  const deck: Deck = []
  
  for (let suit = 0; suit < numberOfSuits; suit++) {
    for (let rank = 0; rank < numberOfRanks; rank++) {
      deck.push({ suit, rank })
    }
  }

  return deck
}
