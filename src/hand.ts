import type { Card, Deck } from "./deck.js"

export type PlayerHand = Card[]
export type PlayerHands = PlayerHand[]

export type DealFunction = ({ deck, numberOfPlayers, atATime }: {
  deck: Deck;
  numberOfPlayers?: number;
  atATime?: number
}) => PlayerHands

export const dealCards: DealFunction = ({ deck, numberOfPlayers = 4, atATime = 1 }): PlayerHands => {
  const hands: PlayerHands = Array.from({ length: numberOfPlayers }, () => [])

  while (deck.length > 0) {
    for (let playerIndex = 0; playerIndex < numberOfPlayers; playerIndex++) {
      for (let count = 0; count < atATime; count++) {
        const card = deck.shift()
        if (card) {
          hands[playerIndex]!.push(card)
        }
        else {
          break
        }
      }
    }
  }

  return hands
}

export const sortHands = (hands: PlayerHands): PlayerHands => hands.map(hand =>
  hand.toSorted((a, b) => {
    if (a.suit !== b.suit) {
      return a.suit - b.suit
    }
    return a.rank - b.rank
  })
)
