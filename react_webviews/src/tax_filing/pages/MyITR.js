import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import DetailsCard from 'common/ui/DetailsCard'
import { getConfig } from 'utils/functions'
import Button from 'common/ui/Button'
import { itrStatusMappings } from '../constants'
import { isEmpty } from 'lodash'

import { storageService } from 'utils/validators'
import { navigate as navigateFunc } from '../common/functions'
import {
  getITRList,
  getUserAccountSummary,
  resumeITRApplication,
} from '../common/ApiCalls'
import { USER_SUMMARY_KEY, ITR_APPLICATIONS_KEY } from '../constants'

import './MyITR.scss'

function MyITR(props) {
  const navigate = navigateFunc.bind(props)
  const productName = getConfig().productName
  const defaultUserSummary = props?.location?.params?.userSummary || {}
  const defaultItrList = props?.location?.params?.itrList || []

  const [showSkeltonLoader, setShowSkeltonLoader] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorData, setErrorData] = useState({})
  const [resuming, setResuming] = useState('')

  const [itrList, setItrList] = useState(defaultItrList)
  const [userSummary, setUserSummary] = useState(defaultUserSummary)

  const closeError = () => {
    setShowError(false)
  }

  const handleResumeApplication = (itrId) => async () => {
    try {
      setShowLoader('button')
      setResuming(itrId)
      const result = await resumeITRApplication(itrId)
      console.log(result)
      setShowLoader(false)
      navigate(
        '/tax-filing/redirection',
        { redirectionUrl: result?.msg?.url },
        false
      )
    } catch (err) {
      setShowLoader(false)
      setShowError(true)
      setErrorData({
        type: 'crash',
        title1: err?.message,
        button_text1: 'CLOSE',
        handleClick1: closeError,
      })
    }
  }

  useEffect(() => {
    fetchITRListAndUserSummary()
  }, [])

  const fetchITRListAndUserSummary = async () => {
    try {
      if (isEmpty(itrList) || isEmpty(userSummary)) {
        setShowSkeltonLoader(true)
        const [list, user] = await Promise.all([
          getITRList(),
          getUserAccountSummary(),
        ])
        setItrList([...list])
        setUserSummary({ ...user })
        storageService().setObject(USER_SUMMARY_KEY, user)
        storageService().setObject(ITR_APPLICATIONS_KEY, list)
        setShowSkeltonLoader(false)
        setShowError(false)
      }
    } catch (err) {
      setShowError(true)
      setErrorData({
        type: 'generic',
        title1: err.message,
        handleClick1: fetchITRListAndUserSummary,
        handleClick2: closeError,
      })
      setShowSkeltonLoader(false)
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
            renderItem: () => (
              <Button
                buttonTitle="RESUME"
                onClick={handleResumeApplication(itrId)}
                showLoader={itrId === resuming ? showLoader : ''}
                disable={showLoader && itrId !== resuming ? true : false}
              />
            ),
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
      skelton={showSkeltonLoader}
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
