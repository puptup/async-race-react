import { useCallback } from 'react'
import { ENGINE, GARAGE } from '../consts'
import { Car } from '../types'

export const useCar = ({
  setGarage,
  getGarage,
}: {
  setGarage: React.Dispatch<React.SetStateAction<Car[]>>
  getGarage: () => void
}) => {
  const startEngine = useCallback(
    async (car: Car) => {
      const { distance, velocity } = await (
        await fetch(`${ENGINE}?id=${car.id}&status=started`, { method: 'PATCH' })
      ).json()
      car.timeToFinish = distance / velocity
      car.engine = true
      setGarage((prev) => [...prev.filter((item) => item.id !== car.id), car])
    },
    [setGarage],
  )

  const stopEngine = useCallback(
    async (car: Car) => {
      if (car.engine) {
        await fetch(`${ENGINE}?id=${car.id}&status=stopped`)
      }
      car.engine = false
      car.timeToFinish = 0
      setGarage((prev) => [...prev.filter((item) => item.id !== car.id), car])
    },
    [setGarage],
  )

  const driveCar = useCallback(
    async (car: Car) => {
      const driveResponce = await fetch(`${ENGINE}?id=${car.id}&status=drive`, {
        method: 'PATCH',
      })
      car.engine = false
      setGarage((prev) => [...prev.filter((item) => item.id !== car.id), car])
      return driveResponce.status
    },
    [setGarage],
  )

  const RemoveCar = useCallback(
    async (car: Car) => {
      await fetch(`${GARAGE}/${car.id}`, {
        method: 'DELETE',
      })
      setGarage((prev) => [...prev.filter((item) => item.id !== car.id)])
      getGarage()
    },
    [getGarage, setGarage],
  )

  return {
    startEngine,
    stopEngine,
    driveCar,
    RemoveCar,
  }
}
