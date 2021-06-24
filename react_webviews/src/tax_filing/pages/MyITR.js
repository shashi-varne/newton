import React, { useState, useEffect } from 'react'
import Container from '../common/Container'
import DetailsCard from 'common/ui/DetailsCard'
import { getConfig } from 'utils/functions'
import Button from 'common/ui/Button'
import { itrStatusMappings } from '../constants'
import { isEmpty } from 'lodash'

import './MyITR.scss'

function MyITR(props) {
  const productName = getConfig().productName

  const user = props?.location?.params?.userSummary.data
  console.log(props?.location?.params)
  const myItrs = props?.location?.params?.itrList.map(
    ({ dt_created: dtCreated, itr_status: itrStatus, itr_id: itrId }) => {
      let status = itrStatus ? itrStatus : 'open'
      const text = itrStatusMappings[status].text
      const color = itrStatusMappings[status].color
      const icn = itrStatusMappings[status].icon
      const icon = require(`assets/${productName}/${icn}.svg`)

      let bottomValues = [
        { title: 'Name', subtitle: user?.name },
        { title: 'Mobile Number', subtitle: user?.mobile },
        { title: 'Created On', subtitle: dtCreated },
      ]

      if (status !== 'completed') {
        bottomValues.push({
          renderItem: () => <Button buttonTitle="RESUME" showLoader={"button"} />,
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
  return (
    <Container title="My ITR" noFooter>
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
