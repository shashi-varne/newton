import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import DetailsCard from 'common/ui/DetailsCard'
import { getConfig } from 'utils/functions'
import Button from 'common/ui/Button'
import { itrStatusMappings } from '../constants'
import { isEmpty } from 'lodash'

import { storageService } from 'utils/validators'

import { getITRList, getUserAccountSummary } from '../common/ApiCalls'
import { USER_SUMMARY_KEY, ITR_APPLICATIONS_KEY } from '../constants'

import './MyITR.scss'

function MyITR(props) {
  const productName = getConfig().productName
  const defaultUserSummary = props?.location?.params?.userSummary || {}
  const defaultItrList = props?.location?.params?.itrList || []

  const [showLoader, setShowLoader] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorData, setErrorData] = useState({})

  const [itrList, setItrList] = useState(defaultItrList)
  const [userSummary, setUserSummary] = useState(defaultUserSummary)

  const closeError = () => {
    setShowError(false)
  }

  useEffect(() => {
    fetchITRListAndUserSummary()
  }, [])

  const fetchITRListAndUserSummary = async () => {
    try {
      if (isEmpty(itrList) || isEmpty(userSummary)) {
        setShowLoader(true)
        const [list, user] = await Promise.all([
          getITRList(),
          getUserAccountSummary(),
        ])
        setItrList([...list])
        setUserSummary({ ...user })
        storageService().setObject(USER_SUMMARY_KEY, user)
        storageService().setObject(ITR_APPLICATIONS_KEY, list)
        setShowLoader(false)
        setShowError(false)
      }
    } catch (err) {
      setShowError(true)
      setErrorData({
        type: 'crash',
        title1: err.message,
        handleClick1: closeError(),
      })
      setShowLoader(false)
    }
  }
  let myItrs = []
  if (!isEmpty(itrList)) {
    myItrs = itrList.map(
      ({ dt_created: dtCreated, itr_status: itrStatus, itr_id: itrId }) => {
        let status = itrStatus ? itrStatus : 'open'
        const text = itrStatusMappings[status].text
        const color = itrStatusMappings[status].color
        const icn = itrStatusMappings[status].icon
        const icon = require(`assets/${productName}/${icn}.svg`)

        let bottomValues = [
          { title: 'Name', subtitle: userSummary?.name },
          { title: 'Mobile Number', subtitle: userSummary?.mobile },
          { title: 'Created On', subtitle: dtCreated },
        ]

        if (status !== 'completed') {
          bottomValues.push({
            renderItem: () => <Button buttonTitle="RESUME" />,
          })
        }

        return {
          color,
          topTextLeft: text,
          backgroundColor: '#FFFFFF',
          headingTitle: 'CA-Assisted Filing',
          headingLogo: icon,
          bottomValues,
        }
      }
    )
  }

  return (
    <Container
      title="My ITR"
      buttonTitle={true}
      showError={showError}
      errorData={errorData}
      skelton={showLoader}
      noFooter
    >
      <div className="tax-filing-my-itr">
        {!isEmpty(myItrs) &&
          myItrs.map((detail, idx) => (
            <DetailsCard item={detail} key={idx} handleClick={() => {}} />
          ))}
      </div>
    </Container>
  )
}

export default MyITR
