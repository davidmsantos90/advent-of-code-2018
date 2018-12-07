/*
  --- Day 2: Inventory Management System --- https://adventofcode.com/2018/day/2

  You stop falling through time, catch your breath, and check the screen on the device. "Destination reached. Current Year: 1518.
  Current Location: North Pole Utility Closet 83N10." You made it! Now, to find those anomalies.

  Outside the utility closet, you hear footsteps and a voice. "...I'm not sure either. But now that so many people have chimneys,
  maybe he could sneak in that way?" Another voice responds, "Actually, we've been working on a new kind of suit that would
  let him fit through tight spaces like that. But, I heard that a few days ago, they lost the prototype fabric,
  the design plans, everything! Nobody on the team can even seem to remember important details of the project!"

  "Wouldn't they have had enough fabric to fill several boxes in the warehouse? They'd be stored together,
  so the box IDs should be similar. Too bad it would take forever to search the warehouse for two similar box IDs..."
  They walk too far away to hear any more.
*/

const { input } = require('./day-2.input')

const countLetterRepetition = (idList = [], targetCount = 0) => {
  return idList.filter((boxID = '') => {
    const letterCount = {}

    boxID.split('').forEach((letter) => {
      if (letterCount[letter] == null) {
        letterCount[letter] = 1
      } else {
        letterCount[letter] += 1
      }
    })

    const boxIDWithTargetCount = Object.entries(letterCount).filter(([letter, count]) => count === targetCount)

    return boxIDWithTargetCount.length > 0
  })
}

const distanceByOne = (boxID = '', otherBoxID = '') => {
  const boxLetters = boxID.split('')
  const otherBoxLetters = otherBoxID.split('')

  const L1 = boxLetters.length
  const L2 = otherBoxLetters.length

  let countDifferent = 0
  let targetIndex = null

  for(let index = 0, max = Math.max(L1, L2); index < max; index++) {
    if (boxLetters[index] !== otherBoxID[index]) {
      countDifferent++

      targetIndex = countDifferent === 1 ? index : null
    }
  }

  return targetIndex
}

const compareWithRest = ([ boxID, ...rest ]) => {
  for(let idx = 0, remainder = rest.length; idx < remainder; idx++) {
    const otherBoxID = rest[idx]

    distanceByOneIndex = distanceByOne(boxID, otherBoxID)

    if (distanceByOneIndex != null) {
      const start = 0
      const end = boxID.length

      const beforeDifference = boxID.substring(start, distanceByOneIndex)
      const afterDifference = boxID.substring(distanceByOneIndex + 1, end)

      return beforeDifference + afterDifference
    }
  }

  return compareWithRest(rest)
}

// ---

const partOne = (boxIdList = []) => {
  const twoLetterList = countLetterRepetition(boxIdList, 2)
  const threeLetterList = countLetterRepetition(boxIdList, 3)

  const twoLength = twoLetterList.length
  const threeLength = threeLetterList.length
  const checksum = twoLength * threeLength

  console.log(` P1: What is the checksum for your list of box IDs?`)
  console.log(` A1: '${ twoLength } * ${ threeLength } = ${ checksum }'\n`)
}

const partTwo = (boxIdList = []) => {
  const correctID = compareWithRest(boxIdList)

  console.log(` P2: What letters are common between the two correct box IDs?`)
  console.log(` A2: '${ correctID }'`)
}

// ----

console.log('##### Day 2 #####')

/*
  --- Part One ---

  Late at night, you sneak to the warehouse - who knows what kinds of paradoxes you could cause if you were discovered -
  and use your fancy wrist device to quickly scan every box and produce a list of the likely candidates (your puzzle input).

  To make sure you didn't miss any, you scan the likely candidate boxes again, counting the number that have an ID
  containing exactly two of any letter and then separately counting those with exactly three of any letter.
  You can multiply those two counts together to get a rudimentary checksum and compare it to what your device predicts.

  For example, if you see the following box IDs:

   - abcdef contains no letters that appear exactly two or three times.
   - bababc contains two a and three b, so it counts for both.
   - abbcde contains two b, but no letter appears exactly three times.
   - abcccd contains three c, but no letter appears exactly two times.
   - aabcdd contains two a and two d, but it only counts once.
   - abcdee contains two e.
   - ababab contains three a and three b, but it only counts once.

  Of these box IDs, four of them contain a letter which appears exactly twice, and three of them contain a letter which appears exactly three times. Multiplying these together produces a checksum of 4 * 3 = 12.

  What is the checksum for your list of box IDs?
*/

partOne(input)

/*
  --- Part Two ---

  Confident that your list of box IDs is complete, you're ready to find the boxes full of prototype fabric.

  The boxes will have IDs which differ by exactly one character at the same position in both strings. For example, given the following box IDs:

   - abcde
   - fghij
   - klmno
   - pqrst
   - fguij
   - axcye
   - wvxyz

  The IDs abcde and axcye are close, but they differ by two characters (the second and fourth).
  However, the IDs fghij and fguij differ by exactly one character, the third (h and u). Those must be the correct boxes.

  What letters are common between the two correct box IDs?
  (In the example above, this is found by removing the differing character from either ID, producing fgij.)
*/

partTwo(input)
