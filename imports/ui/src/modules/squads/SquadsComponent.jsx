import { Col, Dropdown, Row, Table, message } from 'antd'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import React, { useState } from 'react'
import { SquadCollection } from '../../../../api/SquadApi'
import { SQUAD_TABLE_COLUMNS } from './SQUAD_TABLE_COLUMNS'
import SquadModal from './SquadModal'

const SquadsComponent = () => {
  const { squads } = useTracker(() => {
    const sub = Meteor.subscribe('squads')
    const userSub = Meteor.subscribe('users')
    return {
      squads: sub.ready()
        ? SquadCollection.find({})
            .map((squad) => {
              return {
                key: squad._id,
                ...squad,
              }
            })
            .sort((a, b) => a.squadName.localeCompare(b.squadName))
        : null,
      usersReady: userSub.ready(),
    }
  }, [])
  const [rowSelection, setRowSelection] = useState(null)
  const [open, setOpen] = useState(false)
  const [formDisabled, setFormDisabled] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [title, setTitle] = useState('Trupp')
  const [isDisplay, setIsDisplay] = useState(false)
  const data = squads
  const errorText = 'Bitte wähle zuerst ein oder mehr Trupps aus!'
  const securityClearance = Number(Meteor.user()?.profile?.securityClearance)
  const items = [
    {
      key: 'read',
      label: 'Anzeigen',
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          setOpen(true)
          setIsDelete(false)
          setIsDisplay(true)
          setTitle('Trupps anzeigen')
        } else {
          message.warning(errorText)
        }
      },
    },
    securityClearance > 3 && {
      key: 'edit',
      label: 'Bearbeiten',
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          setFormDisabled(false)
          setOpen(true)
          setIsDelete(false)
          setIsDisplay(false)
          setTitle('Trupps bearbeiten')
        } else {
          message.warning(errorText)
        }
      },
    },
    securityClearance > 3 && {
      key: 'delete',
      label: 'Löschen',
      onClick: () => {
        if (rowSelection && rowSelection?.selectedRowKeys?.length) {
          setFormDisabled(false)
          setIsDelete(true)
          setIsDisplay(false)
          setOpen(true)
          setTitle('Trupps löschen')
        } else {
          message.warning(errorText)
        }
      },
    },
  ]
  return (
    <Row>
      <Col span={24}>
        <Table
          scroll={{ x: 150 }}
          title={() => (
            <Row
              gutter={16}
              justify='space-between'
              align='middle'
            >
              <Col flex='auto'>
                <span
                  style={{
                    margin: '0 1.5rem 0 0',
                    padding: 0,
                    fontSize: 24,
                    fontFamily: "'Bebas Neue', sans-serif",
                  }}
                >
                  Truppliste
                </span>
              </Col>
              {securityClearance > 3 && (
                <Col>
                  <Dropdown.Button
                    type='primary'
                    onClick={() => {
                      setFormDisabled(false)
                      setIsDelete(false)
                      setOpen(true)
                      setTitle('Trupp erstellen')
                      setRowSelection({
                        selectedRows: [],
                        selectedRowKeys: [],
                      })
                    }}
                    menu={{
                      items,
                    }}
                  >
                    Erstellen
                  </Dropdown.Button>
                </Col>
              )}
            </Row>
          )}
          columns={SQUAD_TABLE_COLUMNS}
          dataSource={data}
          pagination={
            data?.length > 10
              ? {
                  responsive: true,
                  showTotal: () => <span>{`Insgegsamt: ${data.length} Trupps`}</span>,
                  showSizeChanger: true,
                  hideOnSinglePage: true,
                }
              : false
          }
          loading={!data?.length == null}
          style={{
            padding: '0.5rem',
          }}
          rowSelection={
            securityClearance > 3
              ? {
                  type: 'checkbox',
                  onChange: (selectedRowKeys, selectedRows) => {
                    setRowSelection({ selectedRows, selectedRowKeys })
                  },
                  selectedRowKeys: rowSelection?.selectedRowKeys || [],
                }
              : false
          }
          onRow={(record) => {
            return {
              onClick: () => {
                if (securityClearance < 4) {
                  setRowSelection({
                    selectedRows: [record],
                    selectedRowKeys: [record.key],
                  })
                  setTitle('Trupp anzeigen')
                  setFormDisabled(true)
                  setOpen(true)
                } else {
                  setRowSelection({
                    selectedRows: [record],
                    selectedRowKeys: [record.key],
                  })
                  setTitle('Trupp bearbeiten')
                  setOpen(true)
                }
              },
            }
          }}
        />
      </Col>
      <SquadModal
        title={title}
        open={open}
        setOpen={setOpen}
        ids={rowSelection?.selectedRowKeys}
        formDisabled={formDisabled}
        isDelete={isDelete}
        isDisplay={isDisplay}
      />
    </Row>
  )
}

export default SquadsComponent
