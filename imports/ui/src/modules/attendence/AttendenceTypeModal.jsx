import React, { useRef, useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { Form, Input, Modal, message } from 'antd'

const AttendenceTypeModal = ({ open, setOpen, value, title }) => {
  const ref = useRef()
  const [error, setError] = useState(false)
  const handleCancel = () => {
    setError(false)
    setOpen(false)
  }
  const validate = () => {
    if (!ref?.current?.getFieldValue('name') || ref?.current?.getFieldValue('name') === '') {
      setError(true)
      return false
    } else {
      return true
    }
  }
  const handleOk = () => {
    if (validate()) {
      if (value?._id) {
        Meteor.call('attendenceTypes.update', value._id, { name: ref?.current?.getFieldValue('name') }, (err, res) => {
          if (!err) {
            message.success('Einsatzart wurde erstellt!')
            handleCancel()
          } else {
            console.error(err, res)
            message.error('Einsatzart erstellen fehlgeschlagen!')
          }
        })
      } else {
        Meteor.call('attendenceTypes.create', { name: ref?.current?.getFieldValue('name') }, (err, res) => {
          if (!err) {
            message.success('Einsatzart wurde erstellt!')
            handleCancel()
          } else {
            console.error(err, res)
            message.error('Einsatzart erstellen fehlgeschlagen!')
          }
        })
      }
    }
  }
  return (
    <Modal
      title={title || 'Neue Einsatzart erstellen'}
      open={open}
      onOk={handleOk}
      okText='Speichern'
      onCancel={handleCancel}
      destroyOnClose
      centered
    >
      <Form
        ref={ref}
        layout='vertical'
        initialValues={{ name: value?.label || null }}
      >
        <Form.Item
          name='name'
          label='Einsatzart'
          required
        >
          <Input
            placeholder='Einsatzartbezeichnung'
            status={
              (!ref?.current?.getFieldValue('name') || ref?.current?.getFieldValue('name') === '') && error
                ? 'error'
                : undefined
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AttendenceTypeModal
