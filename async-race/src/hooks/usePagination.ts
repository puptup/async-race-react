import { useCallback, useEffect, useState } from 'react'
import { COUNT_ELEMENTS_ON_GARAGE_PAGE } from '../consts'
import { Car, CarsForWinnersPage } from '../types'

export const usePagination = (
  countElements: number,
  garage: Car[] | CarsForWinnersPage[],
  carsCount: number | undefined,
) => {
  const [page, setPage] = useState<number>()

  const IncrementPage = useCallback(() => {
    if (page && carsCount) {
      if (page < carsCount / COUNT_ELEMENTS_ON_GARAGE_PAGE) {
        setPage(page + 1)
      }
    }
  }, [setPage, page, carsCount])

  const DecrementPage = useCallback(() => {
    if (page) {
      if (page > 1) {
        setPage(page - 1)
      }
    }
  }, [page, setPage])

  useEffect(() => {
    const localPage = window.localStorage.getItem('page')
    if (localPage) {
      setPage(Number(localPage))
    } else {
      setPage(1)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('page', String(page))
  }, [page, setPage])

  return {
    page,
    IncrementPage,
    DecrementPage,
  }
}
