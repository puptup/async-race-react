import React, { FC, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { GARAGE } from '../consts'

interface InputFormProps {
  getGarage: () => void
}

const initState = {
  name: '',
  color: '#af6a6a',
}

const InputForm: FC<InputFormProps> = ({ getGarage }) => {
  const [state, setState] = useState<{ name: string; color: string }>(initState)
  const submit = useCallback(async () => {
    if (state && state.name) {
      await fetch(`${GARAGE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      })
      setState(initState)
      getGarage()
    }
  }, [state, getGarage])

  useEffect(() => {
    const newCar = window.localStorage.getItem('newCar')
    if (newCar) {
      setState(JSON.parse(newCar))
    }
  }, [])

  useEffect(() => {
    console.log('test', state)
    window.localStorage.setItem('newCar', JSON.stringify(state))
  }, [state])

  return (
    <Form>
      <Input
        type='text'
        value={state.name}
        onChange={(e) => setState({ ...state, name: e.target.value })}
      />
      <Input
        type='color'
        value={state.color}
        onChange={(e) => {
          setState({ ...state, color: e.target.value })
        }}
      />
      <button
        type='submit'
        onClick={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        Create
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

export default InputForm
