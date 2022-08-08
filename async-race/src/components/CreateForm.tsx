import React, { FC, useCallback, useState } from 'react'
import styled from 'styled-components'
import { GARAGE } from '../consts'

interface InputFormProps {
  getGarage: () => void
}

const InputForm: FC<InputFormProps> = ({ getGarage }) => {
  const [color, setColor] = useState('#af6a6a')
  const [name, setName] = useState('')
  const submit = useCallback(async () => {
    if (name) {
      await fetch(`${GARAGE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          color,
        }),
      })
      setColor('#af6a6a')
      setName('')
      getGarage()
    }
  }, [name, color, getGarage])

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
