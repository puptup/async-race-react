import { useCallback, useEffect, useState } from 'react'

export const usePagination = (countElements: number, carsCount: number | undefined) => {
  const [page, setPage] = useState<number>()

  const IncrementPage = useCallback(() => {
    if (page && carsCount) {
      if (page < carsCount / countElements) {
        setPage(page + 1)
      }
    }
  }, [setPage, page, carsCount, countElements])

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
