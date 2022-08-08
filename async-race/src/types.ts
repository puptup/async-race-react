export type Car = {
  id: number
  color: string
  name: string
  timeToFinish: number
  engine: boolean
}

export type CarsForWinnersPage = Car & {
  id: number
  time: number
  wins: number
}
