import { Modal } from 'antd'
import React from 'react'
import BriefingForm from './BriefingForm'

const BriefingModal = ({ visible, onCancel }) => {
  return (
    <Modal
      title='Briefings erstellen'
      open={visible}
      onCancel={onCancel ? onCancel : () => null}
      footer={null}
      width={window.innerWidth > 765 ? '60vw' : '90vw'}
      destroyOnClose
    >
      <BriefingForm
        model={visible}
        onCancel={onCancel ? onCancel : () => null}
      />
    </Modal>
  )
}

export default BriefingModal
