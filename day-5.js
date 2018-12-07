/*
  --- Day 5: Alchemical Reduction ---

    You've managed to sneak in to the prototype suit manufacturing lab. The Elves are making decent progress,
    but are still struggling with the suit's size reduction capabilities.

    While the very latest in 1518 alchemical technology might have solved their problem eventually, you can do better.
    You scan the chemical composition of the suit's material and discover that it is formed by extremely long polymers
    (one of which is available as your puzzle input).
*/

const { input, smallerInput, unitTypes } = require('./day-5.input')

// ---

const triggerAllPolymerReactions = (polymerChain = '') => {
  let reaction = { chain: polymerChain, start: 0 }

  while(true) {
    reaction = _triggerPolymerReaction(reaction)

    if (reaction.isStable) break
  }

  return reaction.chain
}

const _triggerPolymerReaction = ({ chain = '', start = 0 }) => {
  const polymerSize = chain.length

  for(let chainPos = start; chainPos < polymerSize; chainPos++) {
    const unitA = chain.charAt(chainPos)
    const unitB = chain.charAt(chainPos + 1)

    const noMoreReactions = unitB == null || unitB === ''
    if (noMoreReactions) return { chain, isStable: true }

    if (_isReaction(unitA, unitB)) {
      const afterPos = chainPos + 2

      const beforeReaction = chain.slice(0, chainPos)
      const afterReaction =  chain.slice(afterPos)

      // console.log(`${ beforeReaction }[${ unitA + unitB }]${ afterReaction }\n`)

      return {
        chain: beforeReaction + afterReaction,
        start: chainPos > 0 ? chainPos - 1 : 0,
        isStable: false
      }
    }
  }

}

const _isReaction = (unitA, unitB) => {
  const isSameUnitType = unitA.toUpperCase() === unitB.toUpperCase()

  return isSameUnitType && unitA !== unitB
}

const _removePolymerUnitType = (polymerChain = '', unitType) => {
  const validUnitType = unitType != null && unitType !== ''
  if (!validUnitType) return polymerChain

  const unitTypeRemoveRegx = new RegExp(unitType, 'gi')

  return polymerChain.replace(unitTypeRemoveRegx, '')
}

const findShortestPolymer = (polymerChain = '') => {
  let shortestPolymer = triggerAllPolymerReactions(polymerChain)
  let shortestPolymerLength = shortestPolymer.length

  unitTypes.forEach((type) => {
    const modifiedPolymerChain = _removePolymerUnitType(polymerChain, type)

    if (modifiedPolymerChain !== polymerChain) {
      const stablePolymerChain = triggerAllPolymerReactions(modifiedPolymerChain)
      const stablePolymerLength = stablePolymerChain.length

      // console.log(`'${ type }/${ type.toUpperCase() }' > '${ stableLength }'`)

      shortestPolymerLength = Math.min(shortestPolymerLength, stablePolymerLength)
      if (shortestPolymerLength === stablePolymerLength) {
        shortestPolymer = stablePolymerChain
      }
    }
  })

  return shortestPolymer
}

// ---

const partOne = (polymerChain = '') => {
  const stablePolymerChain = triggerAllPolymerReactions(polymerChain)

  console.log(` P1: How many units remain after fully reacting the polymer you scanned?`)
  console.log(` A1:  > ${ stablePolymerChain.length }\n`)
}

const partTwo = (polymerChain = '') => {
  let shortestPolymer = findShortestPolymer(polymerChain)

  console.log(` P2: What is the length of the shortest polymer you can produce by removing all units of exactly one type\n     and fully reacting the result?`)
  console.log(` A2:  > ${ shortestPolymer.length }`)
}

// ---

console.log('##### Day 5 #####')

/*
  --- Part One ---

    The polymer is formed by smaller units which, when triggered, react with each other such that two adjacent units of the same type
    and opposite polarity are destroyed. Units' types are represented by letters; units' polarity is represented by capitalization.
    For instance, r and R are units with the same type but opposite polarity, whereas r and s are entirely different types and do not react.

    For example:

     - In aA, a and A react, leaving nothing behind.
     - In abBA, bB destroys itself, leaving aA. As above, this then destroys itself, leaving nothing.
     - In abAB, no two adjacent units are of the same type, and so nothing happens.
     - In aabAAB, even though aa and AA are of the same type, their polarities match, and so nothing happens.

    Now, consider a larger example, dabAcCaCBAcCcaDA:

     - dabAcCaCBAcCcaDA  The first 'cC' is removed.
     - dabAaCBAcCcaDA    This creates 'Aa', which is removed.
     - dabCBAcCcaDA      Either 'cC' or 'Cc' are removed (the result is the same).
     - dabCBAcaDA        No further actions can be taken.

    After all possible reactions, the resulting polymer contains 10 units.

    How many units remain after fully reacting the polymer you scanned?
    (Note: in this puzzle and others, the input is large; if you copy/paste your input, make sure you get the whole thing.)
*/
partOne(input)

/*
  --- Part Two ---
    Time to improve the polymer.

    One of the unit types is causing problems; it's preventing the polymer from collapsing as much as it should.
    Your goal is to figure out which unit type is causing the most problems, remove all instances of it (regardless of polarity),
    fully react the remaining polymer, and measure its length.

    For example, again using the polymer dabAcCaCBAcCcaDA from above:

     - Removing all A/a units produces dbcCCBcCcD. Fully reacting this polymer produces dbCBcD, which has length 6.
     - Removing all B/b units produces daAcCaCAcCcaDA. Fully reacting this polymer produces daCAcaDA, which has length 8.
     - Removing all C/c units produces dabAaBAaDA. Fully reacting this polymer produces daDA, which has length 4.
     - Removing all D/d units produces abAcCaCBAcCcaA. Fully reacting this polymer produces abCBAc, which has length 6.

    In this example, removing all C/c units was best, producing the answer 4.

    What is the length of the shortest polymer you can produce by removing all units of exactly one type and fully reacting the result?
*/
partTwo(input)
