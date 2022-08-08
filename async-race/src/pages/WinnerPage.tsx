import { FC, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { COUNT_ELEMENTS_ON_WINNER_PAGE, GARAGE, WINNERS } from '../consts'
import { usePagination } from '../hooks/usePagination'
import { Car, CarsForWinnersPage } from '../types'
import svgCar from '../assets/svg/car-01.svg'

interface WinnerPageProps {}

const WinnerPage: FC<WinnerPageProps> = () => {
  const [winnersCount, setWinnersCount] = useState<number>(0)
  const [garage, setGarage] = useState<CarsForWinnersPage[]>([])
  const { page, IncrementPage, DecrementPage } = usePagination(
    COUNT_ELEMENTS_ON_WINNER_PAGE,
    winnersCount,
  )
  const [sorting, setSorting] = useState<{ sort: 'wins' | 'time'; order: 'desc' | 'asc' }>({
    sort: 'wins',
    order: 'desc',
  })

  useEffect(() => {
    fetch(`${WINNERS}`)
      .then((res) => res.json())
      .then((res: Car[]) => setWinnersCount(res.length))
  })

  const getGarage = useCallback(async () => {
    const fragmentCars: {
      id: number
      time: number
      wins: number
    }[] = await fetch(
      `${WINNERS}?_page=${page}&_limit=${COUNT_ELEMENTS_ON_WINNER_PAGE}&_sort=${sorting.sort}&_order=${sorting.order}`,
    ).then((res) => res.json())

    const promises = fragmentCars.map((car) => {
      return fetch(`${GARAGE}/${car.id}`)
        .then((res) => res.json())
        .then(
          (res: Car): CarsForWinnersPage => ({
            id: res.id,
            time: car.time,
            color: res.color,
            name: res.name,
            wins: car.wins,
            timeToFinish: 0,
            engine: false,
          }),
        )
    })
    Promise.all(promises).then((cars) => {
      setGarage(cars)
    })
  }, [page, sorting.order, sorting.sort])

  useEffect(() => {
    getGarage()
  }, [getGarage, page])

  const changeSortring = useCallback(
    (sortType: 'wins' | 'time') => {
      console.log(sorting, sortType)
      switch (sortType) {
        case 'wins': {
          if (sorting.sort === 'wins') {
            setSorting((prev) => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }))
          } else {
            setSorting({ sort: 'wins', order: 'desc' })
          }
          return
        }
        case 'time': {
          console.log('do')
          if (sorting.sort === 'time') {
            setSorting((prev) => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }))
          } else {
            setSorting({ sort: 'time', order: 'desc' })
          }
          return
        }
      }
    },
    [sorting],
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <LinkTo to={'/'}>Garage</LinkTo>
      <div>
        <h3>Winners count: {winnersCount} cars</h3>
      </div>
      <h3>Page № {page}</h3>
      <h4>Just click to Wins or Time to sort cars c:</h4>
      <Table>
        <thead style={{ color: '#eee' }}>
          <tr>
            <th>Name</th>
            <th>Car</th>
            <th style={{ cursor: 'pointer', width: 60 }} onClick={() => changeSortring('wins')}>
              Wins{' '}
              {sorting.sort === 'wins' ? <span>{sorting.order === 'asc' ? '↑' : '↓'}</span> : null}
            </th>
            <th style={{ cursor: 'pointer', width: 60 }} onClick={() => changeSortring('time')}>
              Time{' '}
              {sorting.sort === 'time' ? <span>{sorting.order === 'asc' ? '↑' : '↓'}</span> : null}
            </th>
          </tr>
        </thead>
        <tbody>
          {garage.map((car) => {
            return (
              <tr key={car.id}>
                <Td>
                  <h3>{car.name}</h3>
                </Td>
                <Td>
                  <Svg viewBox='0 0 500 200' xmlns='http://www.w3.org/2000/svg'>
                    <use href={svgCar + '#car1'} width={100} fill={car.color}></use>
                  </Svg>
                </Td>
                <Td>{car.wins}</Td>
                <Td>{car.time}</Td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <div style={{ textAlign: 'center', paddingTop: 10 }}>
        <button onClick={DecrementPage}>Prev</button>
        <button onClick={IncrementPage}>Next</button>
      </div>
    </div>
  )
}

export default WinnerPage

const Table = styled.table`
  border: 2px solid white;
  margin: 0 auto;
`

const Td = styled.td`
  padding: 0 10px;
  border: 1px solid white;
`

const Svg = styled.svg`
  overflow: visible;
  height: 40px;
  width: 100px;
  display: block;
`

const LinkTo = styled(Link)`
  color: white;
  margin-bottom: 20px;
  display: block;
`
