import React from 'react'
import Container from '../common/Container'
import DetailsCard from 'common/ui/DetailsCard'
import { getConfig } from 'utils/functions'
import Button from 'common/ui/Button'

import './MyITR.scss'

function MyITR(props) {
  const productName = getConfig().productName
  const item = {
    color: '#35CB5D',
    topTextLeft: 'In Progress',
    backgroundColor: '#FFFFFF',
    headingTitle: 'Self-filing',
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
  return (
    <Container title="My ITR" noFooter>
      <div className="tax-filing-my-itr">
        <DetailsCard item={item} />
      </div>
    </Container>
  )
}

export default MyITR
