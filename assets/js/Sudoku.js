import { GAME_TYPE_EIGHT, GAME_TYPE_FOUR, GAME_TYPE_NINE, GAME_TYPE_SIX } from '../Data/GameDataTypes.js'
import {
  easyBoardTemplateR4,
  easySolutionR4,
  normalBoardTemplateR4,
  normalSolutionR4,
  hardBoardTemplateR4,
  hardSolutionR4,
} from '../Data/FourByFourBoardsRegular.js'
import {
  easyBoardTemplateR6,
  easySolutionR6,
  normalBoardTemplateR6,
  normalSolutionR6,
  hardBoardTemplateR6,
  hardSolutionR6,
} from '../Data/SixBySixBoardsRegular.js'
import {
  easyBoardTemplateR8,
  easySolutionR8,
  normalBoardTemplateR8,
  normalSolutionR8,
  hardBoardTemplateR8,
  hardSolutionR8,
} from '../Data/EightByEightBoardsRegular.js'
import {
  easyBoardTemplateR9,
  easySolutionR9,
  normalBoardTemplateR9,
  normalSolutionR9,
  hardBoardTemplateR9,
  hardSolutionR9,
} from '../Data/NineByNineBoardsRegular.js'
import { CONSTANT } from './Constants.js'

export const getGameVersionDB = (grid_size) => {
  switch (grid_size) {
    case 4:
      return CONSTANT.GAME_VERSION_4X4
    case 6:
      return CONSTANT.GAME_VERSION_6X6
    case 8:
      return CONSTANT.GAME_VERSION_8X8
    default:
      return CONSTANT.GAME_VERSION_9X9
  }
}

export const setSeeds = (type, seed, gameSeed) => {
  const solutionCnt = CONSTANT.SOLUTION_COUNT
  const boardCnt = CONSTANT.BOARD_COUNT
  const keyCount = CONSTANT.KEY_COUNT

  switch (type) {
    case 'solution':
      return seed >= solutionCnt ? 0 : seed * gameSeed
    case 'board':
      return seed >= boardCnt ? 0 : seed + 1
    case 'key':
      return seed >= keyCount ? 0 : seed + 1
    default:
      return seed === 0 ? gameSeed + 1 : gameSeed
  }
}

export const sudokuGen = (level, gridSize, gameType, gameVersion, solutionSeed, boardSeed, keyBoardSeed) => {
  const solutionDB = getDB('solution', level, gridSize, gameVersion)
  const boardDB = getDB('board', level, gridSize, gameVersion)
  const keyDB = getDB('key', level, gridSize, gameVersion)
  let puzzleBoard = boardDB[boardSeed + gridSize]
  let puzzleSolution = solutionDB[solutionSeed + gridSize]
  let gridDigits = keyDB[keyBoardSeed + gridSize].slice(0, gridSize)
  gridDigits = getGameTypeFromDB(gameType, gridSize)
  let gridColors = CONSTANT.COLORS_OTHER
  console.log('puzzleBoard', puzzleBoard)
  console.log('puzzleSolution', puzzleSolution)
  console.log('gridDigits', gridDigits)

  if (gameType === 6) {
    gridColors = getColors(gameType)
    puzzleSolution = reorderString(puzzleSolution, gridDigits)
    puzzleBoard = setBoardTemplate(puzzleBoard, puzzleSolution)
  } else {
    gridColors = CONSTANT.COLORS_OTHER
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

function getGameTypeFromDB(gameType, gridSize) {
  let keyDigits = undefined
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

  return keyDigits
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

function getDB(type, level, gridSize, gameVersion) {
  switch (type) {
    case 'solution':
      switch (gridSize) {
        case 4:
          switch (level) {
            case 1:
              return easySolutionR4
            case 2:
              return normalSolutionR4
            default:
              return hardSolutionR4
          }
          break
        case 6:
          switch (level) {
            case 1:
              return easySolutionR6
            case 2:
              return normalSolutionR6
            default:
              return hardSolutionR6
          }
          break
        case 8:
          switch (level) {
            case 1:
              return easySolutionR8
            case 2:
              return normalSolutionR8
            default:
              return hardSolutionR8
          }
          break
        default:
          switch (level) {
            case 1:
              return easySolutionR9
            case 2:
              return normalSolutionR9
            default:
              return hardSolutionR9
          }
      }
    case 'board':
      switch (gridSize) {
        case 4:
          switch (level) {
            case 1:
              return easyBoardTemplateR4
            case 2:
              return normalBoardTemplateR4
            default:
              return hardBoardTemplateR4
          }
          break
        case 6:
          switch (level) {
            case 1:
              return easyBoardTemplateR6
            case 2:
              return normalBoardTemplateR6
            default:
              return hardBoardTemplateR6
          }
          break
        case 8:
          switch (level) {
            case 1:
              return easyBoardTemplateR8
            case 2:
              return normalBoardTemplateR8
            default:
              return hardBoardTemplateR8
          }
          break
        default:
          switch (level) {
            case 1:
              return easyBoardTemplateR9
            case 2:
              return normalBoardTemplateR9
            default:
              return hardBoardTemplateR9
          }
      }
    default:
      return CONSTANT.KEYBOARD_DIGIT_PATTERENS
  }
}
