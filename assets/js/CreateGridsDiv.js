import { mainSudokuGrid, numberKeys } from './BtnAssign.js'
import { CONSTANT } from './Constants.js'

export const create9Grid = (gridSize) => {
  console.log(gridSize)
  for (let i = 0; i < Math.pow(gridSize, 2); i++) {
    const cellElement = document.createElement('div')
    cellElement.classList.add(`main-grid-cell`)
    cellElement.classList.add(`grid-${gridSize}X${gridSize}`)
    mainSudokuGrid.appendChild(cellElement)
    mainSudokuGrid.classList.add(`grid-${gridSize}`)
  }

  const cells = document.querySelectorAll(`.main-grid-cell`)
  for (let i = 0; i < Math.pow(gridSize, 2); i++) {
    let row = Math.floor(i / gridSize)
    let col = i % gridSize
    if (gridSize === 4) {
      if (row === 1) cells[i].style.marginBottom = '10px'
      if (col === 1) cells[i].style.marginRight = '10px'
    } else if (gridSize === 6) {
      if (row === 1 || row === 3) cells[i].style.marginBottom = '10px'
      if (col === 2) cells[i].style.marginRight = '10px'
    } else if (gridSize === 8) {
      if (row === 1 || row === 3 || row === 5) cells[i].style.marginBottom = '10px'
      if (col === 3) cells[i].style.marginRight = '10px'
    } else if (gridSize === 9) {
      if (row === 2 || row === 5) cells[i].style.marginBottom = '10px'
      if (col === 2 || col === 5) cells[i].style.marginRight = '10px'
    }
  }

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
    }
    numberKeys.appendChild(cellElement)
    numberKeys.classList.add(`grid-${gridSize}`)
  }
}
