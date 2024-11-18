import { mainSudokuGrid, numberKeys } from './BtnAssign.js'
import { CONSTANT } from './Constants.js'

export const createGrid = (gridSize, gameType) => {
  for (let i = 0; i < Math.pow(gridSize, 2); i++) {
    const cellElement = document.createElement('div')
    cellElement.classList.add(`main-grid-cell`)
    cellElement.classList.add(`grid-${gridSize}X${gridSize}`)
    mainSudokuGrid.appendChild(cellElement)
    mainSudokuGrid.classList.add(`grid-${gridSize}`)
  }

  const cells = document.querySelectorAll(`.main-grid-cell`)
  let index = 0
  for (let i = 0; i < Math.pow(gridSize, 2); i++) {
    let row = Math.floor(i / gridSize)
    let col = i % gridSize
    if (gridSize === 4) {
      if (row === 1) cells[index].style.marginBottom = '10px'
      if (col === 1) cells[index].style.marginRight = '10px'
    } else if (gridSize === 6) {
      if (row === 1 || row === 3) cells[index].style.marginBottom = '10px'
      if (col === 2) cells[index].style.marginRight = '10px'
    } else if (gridSize === 8) {
      if (row === 1 || row === 3 || row === 5) cells[index].style.marginBottom = '10px'
      if (col === 3) cells[index].style.marginRight = '10px'
    } else if (gridSize === 9) {
      if (row === 2 || row === 5) cells[index].style.marginBottom = '10px'
      if (col === 2 || col === 5) cells[index].style.marginRight = '10px'
    }
    index++
  }
  let keyBoard = getKeyBoard(gameType)
  for (let i = 0; i < gridSize + 1; i++) {
    const cellElement = document.createElement('div')
    if (i === gridSize) {
      cellElement.classList.add('delete')
      cellElement.setAttribute('id', 'btn-delete')
      cellElement.classList.add(`grid-${gridSize}`)
      cellElement.innerText = 'X'
    } else {
      cellElement.classList.add('number')
      cellElement.classList.add(`grid-${gridSize}`)
      if (gameType === 6) {
        cellElement.classList.add(`color-${i + 1}`)
      } else {
        cellElement.classList.add(`color-main`)
      }

      cellElement.innerText = keyBoard[i]
    }
    numberKeys.appendChild(cellElement)
    numberKeys.classList.add(`grid-${gridSize}`)
  }
}

const getKeyBoard = (gameType) => {
  let keyBoard = CONSTANT.NUMBER
  let colors = undefined

  switch (gameType) {
    case 2:
      keyBoard = CONSTANT.ALPHA
      break
    case 3:
      keyBoard = CONSTANT.ROMAN
      break
    case 4:
      keyBoard = CONSTANT.DOTS
      break
    case 5:
      keyBoard = CONSTANT.SYMBOLS
      break
    case 6:
      keyBoard = CONSTANT.COLOR_NAME
      colors = CONSTANT.COLORS
      break
    default:
      keyBoard = CONSTANT.NUMBER
  }
  return keyBoard
}
