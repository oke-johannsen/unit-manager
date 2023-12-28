import { Input, Modal, message } from 'antd'
import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'

const PasswordResetModal = ({ open, setOpen, userId }) => {
  const PASSWORD_PATTER = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\*\.\-!"§\$%&\*+#':;<>@\d]).{8,}$/
  const handleOk = () => {
    Meteor.call('set.password', userId, password, (err, res) => {
      if (!err) {
        message.success('Das Passwort wurde erfolgreich geändert!')
      } else {
        message.error('Etwas ist schief gelaufen, bitte versuche es erneut!')
        console.error('Error in set.password', err, res)
      }
    })
  }
  const [password, setPassword] = useState(null)
  const [status, setStatus] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState(undefined)
  const validatePassword = (value) => {
    setPassword(value)
    let state
    let newMessage
    if (value?.length <= 0) {
      state = 'error'
      newMessage = 'Bitte Passwort eintragen!'
    } else if (value?.length < 6) {
      state = 'error'
      newMessage = 'Dein Passwort muss aus mindestens 6 Zeichen bestehen!'
    } else if (PASSWORD_PATTER.test(value) === false) {
      state = 'error'
      newMessage =
        'Das Passwort muss aus min. 1 Großbuchstaben, 1 Kleinbuchstaben, 1 Sonderzeichen und 1 Zahl bestehen!'
    }
    setStatus(state)
    setErrorMessage(newMessage)
  }
  return (
    <Modal
      title='Passwort ändern'
      cancelText='Abbrechen'
      onCancel={() => setOpen(false)}
      onOk={handleOk}
      okText='Speichern'
      open={open}
      centered
    >
      <form>
        <input
          name='username'
          autoComplete='username'
          type='text'
          style={{ display: 'none' }}
          hidden
        />
        <Input.Password
          value={password}
          status={status}
          onChange={(e) => validatePassword(e.target.value)}
          autoComplete='current-password'
        />
        {status === 'error' && errorMessage && (
          <div
            role='alert'
            style={{ color: '#dc4446' }}
          >
            {errorMessage}
          </div>
        )}
      </form>
    </Modal>
  )
}

export default PasswordResetModal
