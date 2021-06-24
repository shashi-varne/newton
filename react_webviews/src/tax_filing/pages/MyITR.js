import React from 'react'
import Container from '../common/Container'
import DetailsCard from 'common/ui/DetailsCard'
import { getConfig } from 'utils/functions'
import Button from 'common/ui/Button'
import { itrStatusMappings } from '../constants'

import './MyITR.scss'

function MyITR(props) {
  const productName = getConfig().productName
  const statuses = ['created', 'filed', 'open']
  const baseItem = {
    color: '#35CB5D',
    topTextLeft: 'In Progress',
    backgroundColor: '#FFFFFF',
    headingTitle: 'CA-Assisted Filing',
    headingLogo: require(`assets/${productName}/icn_self_itr.svg`),
    bottomValues: [
      { title: 'Name', subtitle: 'Uttam Paswan' },
      { title: 'Mobile Number', subtitle: '99999999999' },
      { title: 'Created On', subtitle: '12/04/2021, 05:12pm' },
      {
        title: 'Name',
        subtitle: 'Uttam Paswan',
        renderItem: () => <Button buttonTitle="RESUME" />,
      },
    ],
  }
  const items = statuses.map((status) => {
    const text = itrStatusMappings[status].text
    const color = itrStatusMappings[status].color
    const icn = itrStatusMappings[status].icon
    const resumable = Boolean(itrStatusMappings[status].resumable)
    const icon = require(`assets/${productName}/${icn}.svg`)
    console.log(icon)
    return {
      ...baseItem,
      topTextLeft: text,
      color,
      renderItem: resumable ? baseItem.renderItem : null,
      headingLogo: icon,
    }
  })
  return (
    <Container title="My ITR" noFooter>
      <div className="tax-filing-my-itr">
        {items.map((detail, idx) => (
          <DetailsCard item={detail} key={idx} handleClick={() => {}} />
        ))}
      </div>
    </Container>
  )
}

export default MyITR
