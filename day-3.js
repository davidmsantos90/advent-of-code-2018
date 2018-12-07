/*
  --- Day 3: No Matter How You Slice It --- https://adventofcode.com/2018/day/3

    The Elves managed to locate the chimney-squeeze prototype fabric for Santa's suit (thanks to someone who helpfully wrote its box IDs on the wall of the warehouse in the middle of the night). Unfortunately, anomalies are still affecting them - nobody can even agree on how to cut the fabric.

    The whole piece of fabric they're working on is a very large square - at least 1000 inches on each side.

    Each Elf has made a claim about which area of fabric would be ideal for Santa's suit. All claims have an ID and consist of a single rectangle with edges parallel to the edges of the fabric. Each claim's rectangle is defined as follows:

     - The number of inches between the left edge of the fabric and the left edge of the rectangle.
     - The number of inches between the top edge of the fabric and the top edge of the rectangle.
     - The width of the rectangle in inches.
     - The height of the rectangle in inches.

     A claim like #123 @ 3,2: 5x4 means that claim ID 123 specifies a rectangle 3 inches from the left edge, 2 inches from the top edge,
     5 inches wide, and 4 inches tall. Visually, it claims the square inches of fabric represented by #
     (and ignores the square inches of fabric represented by .) in the diagram below:

      +-----------+
      |...........|
      |...........|
      |...#####...|
      |...#####...|
      |...#####...|
      |...#####...|
      |...........|
      |...........|
      |...........|
      +-----------+
*/

const { input } = require('./day-3.input')

const MATRIX_FILL = '.'
const MATRIX_VISIT = 'X'
const MATRIX_OVERLAP = '!'

const makeMatrix = (size) => {
  const row = Array(size).fill(MATRIX_FILL)

  return Array(size).fill(row)
}

const parseClaim = (claim = '') => {
  const claimRegx = /^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/

  const [ /* match */, id, _left, _top, _width, _heigth ] = claimRegx.exec(claim)

  const left = Number(_left)
  const top = Number(_top)

  const rigth = left + Number(_width)
  const bottom = top + Number(_heigth)

  return {
    id, left, rigth, top, bottom
  }
}

const findIntactClaim = (matrix, { id, left, rigth, top, bottom }) => {
  let intactClaim = true

  for(let rowIdx = top; rowIdx < bottom; rowIdx++) {
    matrix[rowIdx].map((column, columnIdx) => {
      const isIntact = column === id

      const onColumnZone = columnIdx >= left && columnIdx < rigth

      if (onColumnZone) intactClaim = intactClaim && isIntact
    })
  }

  return intactClaim ? id : null
}

const fillMatrix = (matrix, { id, left, rigth, top, bottom }) => {
  for(let rowIdx = top; rowIdx < bottom; rowIdx++) {
    matrix[rowIdx] = matrix[rowIdx].map((column, columnIdx) => {
      const isValidPrintLocation = column === MATRIX_FILL

      const onColumnZone = columnIdx >= left && columnIdx < rigth

      if (onColumnZone) return isValidPrintLocation ? id : MATRIX_OVERLAP

      return column
    })
  }

  return matrix
}

const printMatrix = (matrix) => {
  matrix.forEach((row) => {
    console.log(row.join('  ') + '\n')
  })
}

const countOverlaps = (matrix) => {
  let overlaps = 0

  matrix.forEach((row) => {
    overlaps += row.filter((column) => column === MATRIX_OVERLAP).length
  })

  return overlaps
}

// ---

const partOne = (claimList) => {
  let fabricMatrix = makeMatrix(1500)

  claimList.forEach((rawClain) => {
    const claim = parseClaim(rawClain)

    fabricMatrix = fillMatrix(fabricMatrix, claim)
  })

  console.log(` P1: How many square inches of fabric are within two or more claims?`)
  console.log(` A1: '${ countOverlaps(fabricMatrix) }'\n`)
}

const partTwo = (claimList) => {
  let fabricMatrix = makeMatrix(1500)

  claimList.forEach((rawClain) => {
    const claim = parseClaim(rawClain)

    fabricMatrix = fillMatrix(fabricMatrix, claim)
  })

  let intactClaim = null
  claimList.forEach((rawClain) => {
    if (intactClaim != null) return

    const claim = parseClaim(rawClain)

    intactClaim = findIntactClaim(fabricMatrix, claim)
  })

  console.log(` P2: What is the ID of the only claim that doesn't overlap?`)
  console.log(` A2: '${ intactClaim }'`)
}

// ---

console.log('##### Day 3 #####')

/*
  --- Part One ---

    The problem is that many of the claims overlap, causing two or more claims to cover part of the same areas.
    For example, consider the following claims:

     - #1 @ 1,3: 4x4
     - #2 @ 3,1: 4x4
     - #3 @ 5,5: 2x2

    Visually, these claim the following areas:

      +--------+
      |........|
      |...2222.|
      |...2222.|
      |.11XX22.|
      |.11XX22.|
      |.111133.|
      |.111133.|
      |........|
      +--------+

    The four square inches marked with X are claimed by both 1 and 2.
    (Claim 3, while adjacent to the others, does not overlap either of them.)

    If the Elves all proceed with their own plans, none of them will have enough fabric.
    How many square inches of fabric are within two or more claims?
*/
partOne(input)

/*
  --- Part Two ---

    Amidst the chaos, you notice that exactly one claim doesn't overlap by even a single square inch of fabric with any other claim.
    If you can somehow draw attention to it, maybe the Elves will be able to make Santa's suit after all!

    For example, in the claims above, only claim 3 is intact after all claims are made.

    What is the ID of the only claim that doesn't overlap?
*/
partTwo(input)
