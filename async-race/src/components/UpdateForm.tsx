import { FC, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { GARAGE } from '../consts'
import { Car } from '../types'

interface UpdateFormProps {
  getGarage: () => void
  carToUpdate: Car | undefined
}

const UpdateForm: FC<UpdateFormProps> = ({ getGarage, carToUpdate }) => {
  const [color, setColor] = useState('#af6a6a')
  const [name, setName] = useState('')
  const submit = useCallback(async () => {
    if (carToUpdate) {
      await fetch(`${GARAGE}/${carToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          color,
        }),
      })
      setColor('')
      setName('')
      window.localStorage.setItem('selectedCar', '')
      getGarage()
    }
  }, [name, color, getGarage, carToUpdate])

  useEffect(() => {
    if (carToUpdate) {
      setColor(carToUpdate.color)
      setName(carToUpdate.name)
    }
  }, [carToUpdate])

  return (
    <Form>
      <Input type='text' value={name} onChange={(e) => setName(e.target.value)} />
      <Input
        type='color'
        value={color}
        onChange={(e) => {
          setColor(e.target.value)
        }}
      />
      <button
        type='submit'
        onClick={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        Update
      </button>
    </Form>
  )
}

const Input = styled.input`
  height: 20px;
`

const Form = styled.form`
  display: flex;
  align-items: center;
`

export default UpdateForm
