import type { Deck } from './deck.js'

export type ShuffleFunction = (deck: Deck) => Deck

export const shuffleTrulyRandom: ShuffleFunction = (deck) => deck.sort(() => Math.random() - 0.5)

export const shuffleRiffleWithAccuracy = ({ deck, accuracy = 0.5 }: { deck: Deck; accuracy?: number; }): Deck => {
  const halfA = deck.slice(0, Math.floor(deck.length / 2))
  const halfB = deck.slice(Math.floor(deck.length / 2))

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

    if (Math.random() < accuracy) {
      shouldTakeFromA = !shouldTakeFromA
    }
  }

  return deck
}

export const shuffleRiffleWithAccuracyFunctionFactory = (accuracy: number): ShuffleFunction => {
  return (deck: Deck): Deck => shuffleRiffleWithAccuracy({ deck, accuracy })
}

export const shuffle = (
  { 
    deck,
    shufflingFunction,
    shuffleCount,
  }: {
    deck: Deck;
    shufflingFunction: ShuffleFunction;
    shuffleCount: number;
  }): Deck => {
    let shuffledDeck = [...deck]

    for (let i = 0; i < shuffleCount; i++) {
      shuffledDeck = shufflingFunction(deck)
    }

    return shuffledDeck
  }
