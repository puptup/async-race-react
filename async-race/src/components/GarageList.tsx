import { FC } from 'react'

import { Car } from '../types'
import CarCard from './CarCard'

interface GarageListProps {
  garage: Car[]
  drive: (car: Car) => Promise<Car>
  stopDrive: (car: Car) => Promise<void>
  removeCar: (car: Car) => Promise<void>
  selectCar: (car: Car) => void
}

const GarageList: FC<GarageListProps> = ({ garage, drive, stopDrive, removeCar, selectCar }) => {
  return (
    <div>
      {garage
        .sort((a, b) => a.id - b.id)
        .map((car) => (
          <CarCard
            key={car.id}
            car={car}
            drive={drive}
            stopDrive={stopDrive}
            removeCar={removeCar}
            selectCar={selectCar}
          />
        ))}
    </div>
  )
}

export default GarageList
