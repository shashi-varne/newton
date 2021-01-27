import React, { useEffect, useState } from 'react'
import Container from '../../../fund_details/common/Container'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import RatingStar from '../../../fund_details/common/RatingStar'
import './style.scss'
import { storageService } from '../../../utils/validators'

import CartFooter from '../components/CartFooter'
import { getFundList } from '../functions'

import add_cart_icon from '../../../assets/add_cart_icon.png'
import remove_cart_icon from '../../../assets/remove_cart_icon.png'

const returnField = [
  'one_month_return',
  'three_month_return',
  'six_month_return',
  'one_year_return',
  'three_year_return',
  'five_year_return'
]

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}
const FundList = ({ match, classes }) => {
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const handleChange = (_, value) => {
    setValue(value)
  }

  useEffect(() => {
    fetchFunds()
  }, [])

  const fetchFunds = async () => {
    try {
      setLoading(true)
      const funds = await getFundList()
      storageService().setObject('diystore_fundsList', funds)
    } catch (err) {
      console.log('Error', err.message)
    } finally {
      setLoading(false)
      storageService().set('diystore_sortFilter', 'returns')
      storageService().set('diystore_fundOption', 'growth')
      storageService().set('diystore_fundHouse', '')
      
    }
  }

  if (loading) {
    return <h1>Loading...</h1>
  }

  const funds = storageService().getObject('diystore_fundsList')

  return (
    <Container
      classOverRIde="pr-error-container"
      noFooter
      helpContact
      hideInPageTitle
      title="Explore All Mutual Funds"
      classOverRideContainer="pr-container"
    >
      <div style={{ margin: '-20px' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          scrollable
          scrollButtons="on"
          fullWidth
          classes={{
            scrollButtons: 'tab-scroll-buttons',
            scroller: 'tab-scroller',
            flexContainer: 'tab-flex-container',
          }}
        >
          <Tab label="1M" />
          <Tab label="3M" />
          <Tab label="6M" />
          <Tab label="1Y" />
          <Tab label="3Y" />
          <Tab label="5Y" />
        </Tabs>
        
          <TabContainer>
            {funds.filter(item => {
              return item.hasOwnProperty(returnField[value])
            }).map(item => (
              <DiyFundCard {...item} value={value} />
            ))}
          </TabContainer>
        )
      </div>
      <CartFooter />
    </Container>
  )
}

export default FundList

const DiyFundCard = ({ amc_logo_big, amc_logo_small, legal_name, aum, value, fisdom_rating, ...props }) => {
  return (
    <div className="diy-fund-card">
      <div className="diy-fund-card-img" role="button">
        <img
          src={amc_logo_small}
          alt="some"
          width="90"
        />
      </div>
      <div className="diy-fund-card-details">
        <div className="diy-fund-card-name">
          {legal_name}
        </div>
        <div className="diy-fund-card-info-container">
          <div className="diy-fund-card-info">
            <p>AUM: {Math.round(aum, 0)} Crs</p>
            <p>
              Return: <span>{props[returnField[value]]}</span>
            </p>
            <RatingStar value={fisdom_rating} />
          </div>
          <Button
            variant="contained"
            className="cart"
            className={!props?.addedToCart ? 'secondaryColor' : 'defaultColor'}
            color="secondary"
            onClick={() => {}}
          >
            {!props?.addedToCart ? <img src={add_cart_icon} alt="Add to cart" /> : <img src={remove_cart_icon} alt="remove from cart" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
