import { FC, useCallback, useEffect, useState } from 'react'
import GarageList from '../components/GarageList'

import { CARS_MARKS, CARS_MODELS, COUNT_ELEMENTS_ON_GARAGE_PAGE, GARAGE, WINNERS } from '../consts'
import { usePagination } from '../hooks/usePagination'
import { Car } from '../types'
import CreateForm from '../components/CreateForm'
import UpdateForm from '../components/UpdateForm'
import { useCar } from '../hooks/useCar'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

interface GarageProps {}

const Garage: FC<GarageProps> = () => {
  const [garage, setGarage] = useState<Car[]>([])
  const [rasing, setRacing] = useState<boolean>(false)
  const [reseting, setResecting] = useState<boolean>(false)
  const [carToUpdate, setCarToUpdate] = useState<Car>()
  const [winner, setWinner] = useState<Car>()
  const [carsCount, setCarsCount] = useState<number>(0)

  useEffect(() => {
    fetch(`${GARAGE}`)
      .then((res) => res.json())
      .then((res: Car[]) => setCarsCount(res.length))
  })

  const { page, IncrementPage, DecrementPage } = usePagination(
    COUNT_ELEMENTS_ON_GARAGE_PAGE,
    garage,
    carsCount,
  )

  const getGarage = useCallback(() => {
    fetch(`${GARAGE}?_page=${page}&_limit=${COUNT_ELEMENTS_ON_GARAGE_PAGE}&_sort=name`)
      .then((res) => res.json())
      .then((res: Car[]) =>
        setGarage(
          res.map((car) => {
            car.engine = false
            car.timeToFinish = 0
            return car
          }),
        ),
      )
  }, [page])

  const { startEngine, stopEngine, driveCar, RemoveCar } = useCar({ setGarage, getGarage })

  useEffect(() => {
    getGarage()
  }, [getGarage, page])

  const DrivePromise = useCallback(
    (car: Car) =>
      new Promise<Car>(async (resolve, reject) => {
        await startEngine(car)
        const driveStatus = await driveCar(car)
        if (driveStatus === 200) {
          resolve(car)
        }
        if (driveStatus === 500) {
          reject(car)
        }
      }),
    [startEngine, driveCar],
  )

  const ResetWinner = useCallback(() => {
    setWinner(undefined)
  }, [])

  const winnerAsync = useCallback(async (car: Car) => {
    const response = await fetch(`${WINNERS}/${car.id}`)
    if (response.ok) {
      const data: {
        id: number
        wins: number
        time: number
      } = await response.json()

      const time = Number((car.timeToFinish / 1000).toFixed(2))
      if (time < data.time) {
        data.time = time
        data.wins += 1
      }
      fetch(`${WINNERS}/${car.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    } else {
      fetch(`${WINNERS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: car.id,
          time: (car.timeToFinish / 1000).toFixed(2),
          wins: 1,
        }),
      })
    }
  }, [])

  useEffect(() => {
    if (winner) {
      winnerAsync(winner)
    }
  }, [winner, winnerAsync])

  const Race = useCallback(() => {
    ResetWinner()
    setRacing(true)
    setResecting(true)
    const promises: Array<Promise<Car>> = []
    for (const car of garage) {
      promises.push(DrivePromise(car))
    }
    Promise.any(promises).then((car) => setWinner(car))
    Promise.allSettled(promises).then((_) => {
      setResecting(false)
    })
  }, [garage, DrivePromise, ResetWinner])

  const Reset = useCallback(() => {
    setRacing(false)
    for (const car of garage) {
      stopEngine(car)
    }
  }, [garage, stopEngine])

  const GenerateCars = useCallback(() => {
    for (let i = 0; i <= 100; i++) {
      fetch(`${GARAGE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name:
            CARS_MARKS[Math.floor(Math.random() * CARS_MARKS.length)] +
            ' ' +
            CARS_MODELS[Math.floor(Math.random() * CARS_MODELS.length)],
          color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        }),
      })
    }
    getGarage()
  }, [getGarage])

  const selectCar = useCallback((car: Car) => {
    setCarToUpdate(car)
  }, [])

  return (
    <div>
      <LinkTo to={'/winner'}>Winners</LinkTo>
      <CreateForm getGarage={getGarage}></CreateForm>
      <UpdateForm carToUpdate={carToUpdate} getGarage={getGarage}></UpdateForm>
      <div>
        <h3>Garage: {carsCount} cars</h3>
      </div>
      <div>
        <button disabled={rasing} onClick={Race}>
          Race
        </button>
        <button disabled={reseting} onClick={Reset}>
          Reset
        </button>
        <button onClick={GenerateCars}>Generate 100 cars</button>
      </div>

      {winner && (
        <WinnerBlock onClick={ResetWinner}>
          {winner.name} won! Time: {(winner.timeToFinish / 1000).toFixed(2) + 's'}
          <CloseButton onClick={ResetWinner}>X</CloseButton>
        </WinnerBlock>
      )}

      <h3>Page № {page}</h3>
      <GarageList
        garage={garage}
        drive={DrivePromise}
        stopDrive={stopEngine}
        removeCar={RemoveCar}
        selectCar={selectCar}
      />
      <div style={{ textAlign: 'center', paddingTop: 10 }}>
        <button disabled={rasing} onClick={DecrementPage}>
          Prev
        </button>
        <button disabled={rasing} onClick={IncrementPage}>
          Next
        </button>
      </div>
    </div>
  )
}

const LinkTo = styled(Link)`
  color: white;
  margin-bottom: 20px;
  display: block;
`

const WinnerBlock = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 400px;
  background: white;
  color: black;
  display: flex;
  justify-content: center;
  border: 3px solid #eee;
`

const CloseButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
`

export default Garage
