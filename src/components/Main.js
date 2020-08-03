import React, {useEffect, useRef, useState} from 'react'
import './Main.css'
import {Header} from './Header'

const SIZE = 4

export const Main = () => {

  const [items, setItems] = useState([])
  const main = useRef()
  const [matrix, setMatrix] = useState([])
  const [count, setCount] = useState(0)
  const [isAllow, setAllow] = useState(true)

  const getPositions = () => {
    return {
      posX: Math.floor(Math.random() * SIZE),
      posY: Math.floor(Math.random() * SIZE)
    }
  }

  const colorGenerator = (count) => {
    const rgb = {
      r: Math.log2(count) * 4,
      g: Math.log2(count) * 4,
      b: Math.log2(count) * 10
    }
    return {
      backgroundColor: `rgb(${211 + rgb.r}, ${211 + rgb.g}, ${115 + rgb.b})`
    }
  }

  const checkIsNext = (s) => {
    for(let i = 0; i < SIZE; i++) {
      for(let j = 0; j < SIZE; j++) {
        if(i < SIZE - 1 && matrix[i][j] && matrix[i + 1][j]) {
          if(isMatch(i, j, i + 1, j, s).status)
            return true
        }
        if(j < SIZE - 1 && matrix[i][j] && matrix[i][j + 1]) {
          if(isMatch(i, j, i, j + 1, s).status)
            return true
        }
        if(i > 0 && matrix[i][j] && matrix[i - 1][j]) {
          if(isMatch(i, j, i - 1, j, s).status)
            return true
        }
        if(j > 0 && matrix[i][j] && matrix[i][j - 1]) {
          if(isMatch(i, j, i, j - 1, s).status)
            return true
        }
      }
    }
    for(let i = 0; i < SIZE; i++) {
      for(let j = 0; j < SIZE; j++) {
        if(!matrix[i][j])
          return true
      }
    }
    return false
  }

  const init = () => {
    let itemsArr = []
    const visited = []
    let matrixInit = []
    for(let i = 0; i < SIZE; i++) {
      visited[i] = []
      matrixInit[i] = []
    }
    const length = Math.floor(2 + Math.random() * SIZE)
    for(let i = 0; i < length; i++) {
      let {posX, posY} = getPositions()
      while(visited[posX][posY]) {
        ({posX, posY} = getPositions())
      }
      visited[posX][posY] = true
      itemsArr.push({
        text: 2,
        position: {
          i: posX,
          j: posY
        },
        id: (Math.random() * Date.now()).toString()
      })
      matrixInit[posX][posY] = true
    }
    setMatrix(matrixInit)
    setItems(itemsArr)
  }

  const pushRandom = (matrixRef) => {
    let {posX, posY} = getPositions()
    while(matrixRef[posX][posY]) {
      ({posX, posY} = getPositions())
    }
    return {
      posX,
      posY,
      text: Math.random() > 0.9 ? 4 : 2
    }
  }

  const calcPosition = (i, j) => {
    return {
      left: 12 * (j + 1) + 120 * j + j,
      top: 12 * (i + 1) + 120 * i + i
    }
  }

  const isMatch = (i1, j1, i2, j2, itemsArr) => {
    const ind1 = itemsArr.findIndex(item =>
      item.position.i === i1 && item.position.j === j1
    )
    const ind2 = itemsArr.findIndex(item =>
      item.position.i === i2 && item.position.j === j2
    )
    return {
      status: itemsArr[ind1].text === itemsArr[ind2].text,
      ind1,
      ind2
    }
  }

  const congrat = () => {
    alert('You won!')
    setCount(0)
    init()
  }

  const gameOver = () => {
    alert('Game over :-/')
    setCount(0)
    init()
  }

  const keyHandler = ({key}) => {
    if(!isAllow)
      return
    const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    if(!arrows.includes(key))
      return
    let itemsArr = items.slice().filter(i => !i.deleted)
    if(!checkIsNext(itemsArr)) {
      gameOver()
      return
    }
    let matrixRef = matrix.slice()
    let isMoved = false
    switch(key) {
      case 'ArrowUp':
        for(let i = 0; i < SIZE; i++) {
          for(let j = 0; j < SIZE; j++) {
            if(matrixRef[i][j]) {
              for(let k = 0; k < i; k++) {
                if(!matrixRef[k][j]) {
                  const ind = itemsArr.findIndex(item =>
                    item.position.i === i && item.position.j === j
                  )
                  itemsArr[ind].position.i = k
                  matrixRef[i][j] = false
                  matrixRef[k][j] = true
                  isMoved = true
                  break
                }
              }
            }
          }
        }
        for(let j = 0; j < SIZE; j++) {
          for(let i = SIZE - 1; i > 0; i--) {
            if(matrixRef[i][j] && matrixRef[i - 1][j]) {
              const res = isMatch(i, j, i - 1, j, itemsArr)
              if(res.status) {
                itemsArr[res.ind2].text *= 2
                itemsArr[res.ind1].deleted = 'up'
                matrixRef[i][j] = false
                setCount((count) => count + itemsArr[res.ind2].text)
                break
              }
            }
          }
        }
        break
      case
      'ArrowDown':
        for(let i = SIZE - 1; i >= 0; i--) {
          for(let j = 0; j < SIZE; j++) {
            if(matrixRef[i][j]) {
              for(let k = SIZE - 1; k > i; k--) {
                if(!matrixRef[k][j]) {
                  const ind = itemsArr.findIndex(item =>
                    item.position.i === i && item.position.j === j && !item.deleted
                  )
                  itemsArr[ind].position.i = k
                  matrixRef[i][j] = false
                  matrixRef[k][j] = true
                  isMoved = true
                  break
                }
              }
            }
          }
        }
        for(let j = 0; j < SIZE; j++) {
          for(let i = 0; i < SIZE - 1; i++) {
            if(matrixRef[i][j] && matrixRef[i + 1][j]) {
              const res = isMatch(i, j, i + 1, j, itemsArr)
              if(res.status) {
                itemsArr[res.ind2].text *= 2
                itemsArr[res.ind1].deleted = 'down'
                matrixRef[i][j] = false
                setCount((count) => count + itemsArr[res.ind2].text)
                break
              }
            }
          }
        }
        break
      case
      'ArrowLeft':
        for(let i = 0; i < SIZE; i++) {
          for(let j = 0; j < SIZE; j++) {
            if(matrixRef[i][j]) {
              for(let k = 0; k < j; k++) {
                if(!matrixRef[i][k]) {
                  const ind = itemsArr.findIndex(item =>
                    item.position.i === i && item.position.j === j && !item.deleted
                  )
                  itemsArr[ind].position.j = k
                  matrixRef[i][j] = false
                  matrixRef[i][k] = true
                  isMoved = true
                  break
                }
              }
            }
          }
        }
        for(let i = 0; i < SIZE; i++) {
          for(let j = SIZE - 1; j > 0; j--) {
            if(matrixRef[i][j] && matrixRef[i][j - 1]) {
              const res = isMatch(i, j, i, j - 1, itemsArr)
              if(res.status) {
                itemsArr[res.ind2].text *= 2
                itemsArr[res.ind1].deleted = 'left'
                matrixRef[i][j] = false
                setCount((count) => count + itemsArr[res.ind2].text)
                break
              }
            }
          }
        }
        break
      case
      'ArrowRight':
        for(let i = 0; i < SIZE; i++) {
          for(let j = SIZE - 1; j >= 0; j--) {
            if(matrixRef[i][j]) {
              for(let k = SIZE - 1; k > j; k--) {
                if(!matrixRef[i][k]) {
                  const ind = itemsArr.findIndex(item =>
                    item.position.i === i && item.position.j === j && !item.deleted
                  )
                  itemsArr[ind].position.j = k
                  matrixRef[i][j] = false
                  matrixRef[i][k] = true
                  isMoved = true
                  break
                }
              }
            }
          }
        }
        for(let i = 0; i < SIZE; i++) {
          for(let j = 0; j < SIZE - 1; j++) {
            if(matrixRef[i][j] && matrixRef[i][j + 1]) {
              const res = isMatch(i, j, i, j + 1, itemsArr)
              if(res.status) {
                itemsArr[res.ind2].text *= 2
                itemsArr[res.ind1].deleted = 'right'
                matrixRef[i][j] = false
                setCount((count) => count + itemsArr[res.ind2].text)
                break
              }
            }
          }
        }
        break
      default:
        return
    }
    if(isMoved) {
      const push = pushRandom(matrixRef)
      itemsArr.push({
        text: push.text,
        position: {
          i: push.posX,
          j: push.posY
        },
        id: (Math.random() * Date.now()).toString()
      })
      matrixRef[push.posX][push.posY] = true
    }
    setTimeout(() => {
      const isOver = itemsArr.findIndex(item => item.text >= 2048) > -1
      if(isOver) {
        congrat()
      }
    }, 200)
    setAllow(false)
    setTimeout(() => {
      setAllow(true)
    }, 250)
    setItems(itemsArr)
    setMatrix(matrixRef)
  }

  useEffect(() => {
    init()
    main.current.focus()
  }, [])

  return (
    <>
      <Header count={count}/>
      <div className="main-container"
           ref={main}
           tabIndex={0} onKeyDown={keyHandler}>
        {
          Array.from({length: SIZE ** 2}).map((_, ind) =>
            <div key={`${ind}`} className="grid-item">
            </div>
          )
        }
        {items.map(item =>
          <div
            key={item.id}
            className={`item ${item.deleted ? `${item.deleted}` : ''}`}
            style={{
              ...calcPosition(item.position.i, item.position.j),
              ...colorGenerator(item.text)
            }}
          >
            {!item.deleted && <p className="item-text">{item.text}</p>}
          </div>
        )}
      </div>
    </>
  )
}
