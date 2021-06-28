import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import DetailsCard from 'common/ui/DetailsCard'
import { getConfig } from 'utils/functions'
import Button from 'common/ui/Button'
import { itrStatusMappings } from '../constants'
import { isEmpty } from 'lodash'
import moment from 'moment'

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
  const defaultUserSummary = props?.location?.params?.userSummary?.user || {}
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
        const [list, summary] = await Promise.all([
          getITRList(),
          getUserAccountSummary(),
        ])
        console.log(list, summary)
        setItrList([...list])
        setUserSummary({ ...summary })
        storageService().setObject(USER_SUMMARY_KEY, summary)
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
      ({
        dt_created: dtCreated,
        itr_status: itrStatus,
        itr_id: itrId,
        type,
      }) => {
        let status = itrStatus ? itrStatus : 'open'
        const text = itrStatusMappings[status].text
        const color = itrStatusMappings[status].color
        const icn = itrStatusMappings[status].icon
        const icon = require(`assets/${productName}/${icn}.svg`)
        // const dt = new Date(dtCreated).toLocaleDateString()
        // const time = new Date(dtCreated).toLocaleTimeString()
        const dateTime = moment(dtCreated).format('DD/MM/YYYY, hh:mma')
        const filingType = type === 'eCA' ? 'CA-Assisted Filing' : 'Self-filing'
        let bottomValues = [
          { title: 'Name', subtitle: userSummary?.user?.name },
          { title: 'Mobile Number', subtitle: userSummary?.user?.mobile },
          { title: 'Created On', subtitle: dateTime },
        ]

        if (status !== 'filed') {
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
          headingTitle: filingType,
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
