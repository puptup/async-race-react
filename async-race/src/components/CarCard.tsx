import svgCar from '../assets/svg/car-01.svg'

import { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { Car } from '../types'
import styled from 'styled-components'
import React from 'react'

interface CarCardProps {
  car: Car
  drive: (car: Car) => Promise<Car>
  stopDrive: (car: Car) => Promise<void>
  removeCar: (car: Car) => Promise<void>
  selectCar: (car: Car) => void
}

const CarCard: FunctionComponent<CarCardProps> = ({
  car,
  drive,
  stopDrive,
  removeCar,
  selectCar,
}) => {
  const element = useRef() as React.MutableRefObject<HTMLDivElement>
  const [engine, setEngine] = useState<boolean>(false)
  const [carSvg, setCarSvg] = useState<string>('')
  const animation = useRef<Animation>()

  const reset = useCallback(() => {
    if (car.engine) {
      stopDrive(car)
    }
    setEngine(false)
    animation.current?.cancel()
  }, [car, stopDrive])

  useEffect(() => {
    if (element && car.timeToFinish !== 0) {
      animation.current = element.current.animate(
        [{ transform: 'translateX(0)' }, { transform: `translateX(calc(100vw - 100px))` }],
        {
          fill: 'forwards',
          duration: car.timeToFinish,
        },
      )
    } else {
      reset()
    }
  }, [car.timeToFinish, reset])

  useEffect(() => {
    if (animation) {
      if (car.engine) {
        setEngine(true)
        animation.current?.play()
      } else {
        animation.current?.pause()
      }
    }
  }, [car.engine])

  useEffect(() => {
    setCarSvg(svgCar + '#car1')
  }, [])

  return (
    <Div>
      <DivButtons>
        <Button onClick={() => selectCar(car)}>Select</Button>
        <Button
          onClick={() => {
            removeCar(car)
          }}
        >
          Remove
        </Button>
      </DivButtons>
      <Button
        disabled={engine}
        onClick={() => {
          drive(car)
        }}
      >
        A
      </Button>
      <Button disabled={!engine} onClick={() => reset()}>
        B
      </Button>
      <AnimatedBlock ref={element}>
        <Svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'>
          <use href={carSvg} width={100} fill={car.color}></use>
        </Svg>
      </AnimatedBlock>
      <h4 style={{ paddingLeft: 10 }}>{car.name}</h4>
    </Div>
  )
}

const DivButtons = styled.div`
  position: absolute;
  display: flex;
  top: 10px;
`

const Svg = styled.svg`
  overflow: visible;
  height: 40px;
  display: block;
`

const AnimatedBlock = styled.div`
  position: absolute;
  bottom: 0;
`

const Div = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed white;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    height: 95%;
    width: 1px;
    left: calc(100vw - 105px);
    background: white;
  }
`

const Button = styled.button`
  display: block;
  height 20px;
`

export default CarCard
