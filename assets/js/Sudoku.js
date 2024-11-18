import { GAME_TYPE_EIGHT, GAME_TYPE_FOUR, GAME_TYPE_NINE, GAME_TYPE_SIX } from '../Data/GameDataTypes.js'
import {
  easyBoardTemplate,
  easySolution,
  normalBoardTemplate,
  normalSolution,
  hardBoardTemplate,
  hardSolution,
} from '../Data/NineByNineBoardsRegular.js'
import { CONSTANT } from './Constants.js'

export const sudokuGen = (level, gridSize, gameType) => {
  let puzzleBoard = undefined
  let puzzleSolution = undefined
  let gridDigits = undefined
  let gridColors = undefined
  switch (gridSize) {
    case 4:
      puzzleBoard = getBoardFromDB(level)
      puzzleSolution = getSolutionFromDB(level)
      gridDigits = getGameTypeFromDB(gameType, gridSize)
      console.log('4X4 not set up yet')
      break
    case 6:
      puzzleBoard = getBoardFromDB(level)
      puzzleSolution = getSolutionFromDB(level)
      gridDigits = getGameTypeFromDB(gameType, gridSize)
      console.log('6X6 not set up yet')
    case 8:
      puzzleBoard = getBoardFromDB(level)
      puzzleSolution = getSolutionFromDB(level)
      gridDigits = getGameTypeFromDB(gameType, gridSize)
      console.log('8X8 not set up yet')
      break
    default:
      puzzleBoard = getBoardFromDB(level)
      puzzleSolution = getSolutionFromDB(level)
      gridDigits = getGameTypeFromDB(gameType, gridSize)
  }

  if (gameType === 6) {
    gridColors = getColors(gameType)
    puzzleSolution = reorderString(puzzleSolution, gridDigits)
    puzzleBoard = setBoardTemplate(puzzleBoard, puzzleSolution)
  } else {
    gridColors = ['#6a6a6a', '#6a6a6a', '#6a6a6a', '#6a6a6a', '#6a6a6a', '#6a6a6a', '#6a6a6a', '#6a6a6a', '#6a6a6a']
    puzzleSolution = reorderString(puzzleSolution, gridDigits)
    puzzleBoard = setBoardTemplate(puzzleBoard, puzzleSolution)
  }

  let sudoku = breakDown(puzzleSolution, gridSize)
  let question = breakDown(puzzleBoard, gridSize)
  let keyDigits = gridDigits
  let keyColors = gridColors

  return {
    original: sudoku,
    question: question,
    keyDigits: keyDigits,
    keyColors: keyColors,
  }
}

function getBoardFromDB(level) {
  let puzzleBoard = undefined
  const boardIndex = Math.floor(Math.random() * 4000) + 1
  switch (level) {
    case 3:
      puzzleBoard = hardBoardTemplate[boardIndex]
      break
    case 2:
      puzzleBoard = normalBoardTemplate[boardIndex]
      break
    default:
      puzzleBoard = easyBoardTemplate[boardIndex]
  }

  return puzzleBoard
}

function getSolutionFromDB(level) {
  let puzzleSolution = undefined
  const solutionIndex = Math.floor(Math.random() * 4000) + 365
  switch (level) {
    case 3:
      puzzleSolution = hardSolution[solutionIndex]
      break
    case 2:
      puzzleSolution = normalSolution[solutionIndex]
      break
    default:
      puzzleSolution = easySolution[solutionIndex]
  }

  return puzzleSolution
}

function getGameTypeFromDB(gameType, gridSize) {
  let keyDigits = undefined
  const digitsName = CONSTANT.GMAE_ENUM[gameType - 1]
  switch (gameType) {
    case 2:
      if (gridSize === 4) {
        keyDigits = GAME_TYPE_FOUR.ALPHA
      } else if (gridSize === 6) {
        keyDigits = GAME_TYPE_SIX.ALPHA
      } else if (gridSize === 8) {
        keyDigits = GAME_TYPE_EIGHT.ALPHA
      } else {
        keyDigits = GAME_TYPE_NINE.ALPHA
      }
      break
    case 3:
      if (gridSize === 4) {
        keyDigits = GAME_TYPE_FOUR.ROMAN
      } else if (gridSize === 6) {
        keyDigits = GAME_TYPE_SIX.ROMAN
      } else if (gridSize === 8) {
        keyDigits = GAME_TYPE_EIGHT.ROMAN
      } else {
        keyDigits = GAME_TYPE_NINE.ROMAN
      }
      break
    case 4:
      if (gridSize === 4) {
        keyDigits = GAME_TYPE_FOUR.DOTS
      } else if (gridSize === 6) {
        keyDigits = GAME_TYPE_SIX.DOTS
      } else if (gridSize === 8) {
        keyDigits = GAME_TYPE_EIGHT.DOTS
      } else {
        keyDigits = GAME_TYPE_NINE.DOTS
      }
      break
    case 5:
      if (gridSize === 4) {
        keyDigits = GAME_TYPE_FOUR.SYMBOLS
      } else if (gridSize === 6) {
        keyDigits = GAME_TYPE_SIX.SYMBOLS
      } else if (gridSize === 8) {
        keyDigits = GAME_TYPE_EIGHT.SYMBOLS
      } else {
        keyDigits = GAME_TYPE_NINE.SYMBOLS
      }
      break
    case 6:
      if (gridSize === 4) {
        keyDigits = GAME_TYPE_FOUR.NUMBER
      } else if (gridSize === 6) {
        keyDigits = GAME_TYPE_SIX.NUMBER
      } else if (gridSize === 8) {
        keyDigits = GAME_TYPE_EIGHT.NUMBER
      } else {
        keyDigits = GAME_TYPE_NINE.NUMBER
      }
      break
    default:
      if (gridSize === 4) {
        keyDigits = GAME_TYPE_FOUR.NUMBER
      } else if (gridSize === 6) {
        keyDigits = GAME_TYPE_SIX.NUMBER
      } else if (gridSize === 8) {
        keyDigits = GAME_TYPE_EIGHT.NUMBER
      } else {
        keyDigits = GAME_TYPE_NINE.NUMBER
      }
  }
  const shuffledArray = shuffleWithSeed(keyDigits, CONSTANT.BEGIN_DATE, CONSTANT.TODAY_DATE)

  return shuffledArray
}

function shuffleWithSeed(array, date1, date2) {
  // Calculate the number of days between the two dates
  const oneDay = 24 * 60 * 60 * 1000 // milliseconds in a day
  const diffDays = Math.round(Math.abs((date1 - date2) / oneDay))

  // Use the difference as a seed for the random number generator
  const seed = diffDays

  // Shuffle the array using the Fisher-Yates algorithm with the seeded random number generator
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed) * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

function reorderString(inputString, targetArray) {
  const totalChars = inputString.length
  let reorderedString = ''

  // Iterate over all characters in chunks of size equal to the target array length
  for (let i = 0; i < totalChars; i++) {
    const chunk = parseInt(inputString.slice(i, i + 1), 10) // Extract the current chunk
    reorderedString += targetArray[chunk - 1]
  }
  return reorderedString
}

function setBoardTemplate(boardTemplate, solutionArray) {
  const totalChars = boardTemplate.length
  let newBoard = ''

  // Iterate over all characters in chunks of size equal to the target array length
  for (let i = 0; i < totalChars; i++) {
    const oldBoard = boardTemplate.slice(i, i + 1) // Extract the current chunk
    const oldSolution = solutionArray.slice(i, i + 1) // Extract the current chunk

    if (oldBoard === '-') {
      newBoard += oldBoard
    } else {
      newBoard += oldSolution
    }
  }
  return newBoard
}

function breakDown(board, gridSize) {
  const newBoard = []
  let temprow = []
  for (let i = 0; i < board.length + 1; i++) {
    if ((i + 1) % gridSize === 0) {
      if (i !== 0) {
        temprow.push(board[i])
        newBoard.push(temprow)
        temprow = []
      } else {
        temprow.push(board[i])
      }
    } else {
      temprow.push(board[i])
    }
  }
  return newBoard
}

function getColors(gameType) {
  return CONSTANT.COLORS
}
