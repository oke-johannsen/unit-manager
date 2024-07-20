import { Button, Col, Dropdown, Grid, Row, Segmented, Spin, Table, message } from 'antd'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import React, { useState } from 'react'
import { SkillsCollection } from '../../../../api/SkillsApi'
import AddSkillModal from './AddSkillModal'
import { SKILLS_COLUMNS, getTypeName } from './SKILLS_COLUMNS'
import SkillsModal from './SkillsModal'

const SkillsComponent = () => {
  const [type, setType] = useState('all')
  const { ready, skills } = useTracker(() => {
    const sub = Meteor.subscribe('users')
    const subSkills = Meteor.subscribe('skills')
    skillsFilter = type === 'all' ? {} : { designation: type }
    const skills = SkillsCollection.find({ ...skillsFilter })
      .map((item) => {
        return {
          ...item,
          key: item?._id,
        }
      })
      .sort((a, b) => getTypeName(a.type).localeCompare(getTypeName(b.type)))
    return {
      ready: sub.ready() && subSkills.ready(),
      skills,
    }
  }, [type])
  const [rowSelection, setRowSelection] = useState(null)
  const [open, setOpen] = useState(false)
  const [addContextOpen, setAddContextOpen] = useState(false)
  const [formDisabled, setFormDisabled] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [title, setTitle] = useState('Ausbildung')
  const errorText = 'Bitte wähle zuerst ein oder mehr Ausbildungen aus!'
  const securityClearance = Number(Meteor.user()?.profile?.securityClearance)
  const items = [
    {
      key: 'read',
      label: 'Anzeigen',
      onClick: () => {
        if (rowSelection?.selectedRowKeys?.length) {
          setFormDisabled(true)
          setOpen(true)
          setIsDelete(false)
          setTitle('Ausbildungen anzeigen')
        } else {
          message.warning(errorText)
        }
      },
    },
    securityClearance > 3 && {
      key: 'edit',
      label: 'Bearbeiten',
      onClick: () => {
        if (rowSelection?.selectedRowKeys?.length) {
          setFormDisabled(false)
          setOpen(true)
          setIsDelete(false)
          setTitle('Ausbildungen bearbeiten')
        } else {
          message.warning(errorText)
        }
      },
    },
    securityClearance > 3 && {
      key: 'delete',
      label: 'Löschen',
      onClick: () => {
        if (rowSelection?.selectedRowKeys?.length) {
          setFormDisabled(false)
          setIsDelete(true)
          setOpen(true)
          setTitle('Ausbildungen löschen')
        } else {
          message.warning(errorText)
        }
      },
    },
  ]
  const breakpoints = Grid.useBreakpoint()
  return (
    <Row align='middle'>
      <Col span={24}>
        <Spin spinning={!ready}>
          <Table
            scroll={{ x: 150 }}
            title={() => (
              <Row
                gutter={[16, 16]}
                justify='space-between'
                align='middle'
              >
                <Col>
                  <span
                    style={{
                      margin: '0 1.5rem 0 0',
                      padding: 0,
                      fontSize: 24,
                      fontFamily: "'Bebas Neue', sans-serif",
                    }}
                  >
                    Ausbildungen
                  </span>
                </Col>
                {breakpoints.xs && securityClearance > 3 && (
                  <Col>
                    <Dropdown.Button
                      type='primary'
                      onClick={() => {
                        setFormDisabled(false)
                        setIsDelete(false)
                        setOpen(true)
                        setTitle('Ausbildung erstellen')
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
                <Col flex='auto'>
                  <Segmented
                    onChange={(value) => setType(value)}
                    value={type}
                    options={[
                      {
                        label: 'Alle',
                        value: 'all',
                      },
                      {
                        label: 'Kommando',
                        value: 'infantry',
                      },
                      {
                        label: 'Luftwaffe',
                        value: 'pilot',
                      },
                    ]}
                    block
                  />
                </Col>
                {!breakpoints.xs && securityClearance > 1 && (
                  <Col>
                    <Button onClick={() => setAddContextOpen(true)}>Ausbildung zuweisen</Button>
                  </Col>
                )}
                {!breakpoints.xs && securityClearance > 3 && (
                  <Col>
                    <Dropdown.Button
                      type='primary'
                      onClick={() => {
                        setFormDisabled(false)
                        setIsDelete(false)
                        setOpen(true)
                        setTitle('Ausbildung erstellen')
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
            style={{ padding: '0.5rem' }}
            dataSource={skills}
            columns={SKILLS_COLUMNS}
            pagination={
              skills?.length > 10
                ? {
                    responsive: true,
                    showTotal: () => <span>{`Insgegsamt: ${skills.length} Ausbildungen`}</span>,
                    showSizeChanger: true,
                    hideOnSinglePage: true,
                  }
                : false
            }
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
            onRow={(record, index) => {
              return {
                onClick: () => {
                  if (securityClearance < 4) {
                    setRowSelection({
                      selectedRows: [record],
                      selectedRowKeys: [record.key],
                    })
                    setTitle('Ausbildung anzeigen')
                    setFormDisabled(true)
                    setOpen(true)
                  } else {
                    setRowSelection({
                      selectedRows: [record],
                      selectedRowKeys: [record.key],
                    })
                    setTitle('Ausbildung bearbeiten')
                    setOpen(true)
                  }
                },
              }
            }}
          />
        </Spin>
      </Col>
      <AddSkillModal
        title='Ausbildung hinzufügen'
        open={addContextOpen}
        setOpen={setAddContextOpen}
      />
      <SkillsModal
        title={title}
        open={open}
        setOpen={setOpen}
        ids={rowSelection?.selectedRowKeys}
        formDisabled={formDisabled}
        isDelete={isDelete}
      />
    </Row>
  )
}

export default SkillsComponent
