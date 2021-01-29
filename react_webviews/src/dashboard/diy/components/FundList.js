import React, { useEffect, useState } from 'react'
import Container from '../../../fund_details/common/Container'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import RatingStar from '../../../fund_details/common/RatingStar'
import './style.scss'
import { storageService } from '../../../utils/validators'

import CartFooter from '../components/CartFooter'
import { getFundList } from '../functions'
import {
  CART,
  FUNDOPTION,
  FUNDSLIST,
  SORTFILTER,
  FUNDHOUSE,
  CART_LIMIT,
} from '../constants'

import add_cart_icon from '../../../assets/add_cart_icon.png'
import remove_cart_icon from '../../../assets/remove_cart_icon.png'

const returnField = [
  'one_month_return',
  'three_month_return',
  'six_month_return',
  'one_year_return',
  'three_year_return',
  'five_year_return',
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
  const [fundsList, setFundsList] = useState(
    storageService().getObject(FUNDSLIST) || []
  )
  const [sortFilter, setSortFilter] = useState('returns')
  const [fundOption, setFundOption] = useState('growth')
  const [fundHouse, setFundHouse] = useState('')
 
  const [cart, setCart] = useState(storageService().getObject(CART) || [])
  const [showLoader, setShowLoader] = useState(false)
  const handleChange = (_, value) => {
    setValue(value)
  }

  useEffect(() => {
    const { key, name, type } = match.params
    fetchFunds({ key, name, type })
  }, [])

  const fetchFunds = async ({ key, name, type }) => {
    try {
      setShowLoader(true)
      if (fundsList.length === 0) {
        const funds = await getFundList({ key, name, type })
        setFundsList([...funds])
        storageService().setObject(FUNDSLIST, funds)
      }
    } catch (err) {
      console.log('Error', err.message)
    } finally {
      setShowLoader(false)
    }
  }

  const handleCart = (item) => () => {
    const index = cart.findIndex(({ isin }) => item.isin === isin)
    if (index !== -1) {
      const updatedCart = cart.filter(({ isin }) => isin !== item.isin)
      setCart([...updatedCart])
      storageService().setObject(CART, updatedCart)
    } else {
      if (cart.length < CART_LIMIT)
        setCart((cart) => {
          return [...cart, item]
        })
      storageService().setObject(CART, [...cart, item])
    }
  }

  return (
    <Container
      classOverRIde="pr-error-container"
      noFooter
      helpContact
      hideInPageTitle
      title="Explore All Mutual Funds"
      showLoader={showLoader}
      classOverRideContainer="pr-containe>r"
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
          {fundsList
            .filter((item) => {
              if (!fundHouse) {
                return item.hasOwnProperty(returnField[value]) && item.three_year_return !== null && item.growth_or_dividend === fundOption && item.sip === true
              }

                return item.hasOwnProperty(returnField[value]) && item.three_year_return !== null && item.growth_or_dividend === fundOption && item.sip === true && item.fund_house === fundHouse
              
            })
            .sort(
              (a, b) => {
                return Number(b[returnField[value]]) - Number(a[returnField[value]])
              }
            ).
            sort((a, b) => {
              if (sortFilter === 'returns') {
                return a.threeY - b.threeY
              }
              if (sortFilter === 'rating') {
                return a.rating - b.rating
              }
              if (sortFilter === 'fundsize') {
                return a.aum - b.aum
              }
            })
            .map((item) => (
              <DiyFundCard
                {...item}
                value={value}
                handleCart={handleCart}
                addedToCart={cart.map(({ isin }) => isin).includes(item.isin)}
              />
            ))}
        </TabContainer>
        )
      </div>
      <CartFooter
        cart={cart}
        fundsList={fundsList}
        setCart={setCart}
        setFundsList={setFundsList}
        sortFilter={sortFilter}
        fundHouse={fundHouse}
        fundOption={fundOption}
        setSortFilter={setSortFilter}
        setFundHouse={setFundHouse}
        setFundsList={setFundOption}
        setFundOption={setFundOption}
      />
    </Container>
  )
}

export default FundList

const DiyFundCard = ({ value, handleCart, addedToCart, ...props }) => {
  return (
    <div className="diy-fund-card">
      <div className="diy-fund-card-img">
        <img src={props.amc_logo_small} alt="some" width="90" />
      </div>
      <div className="diy-fund-card-details">
        <div className="diy-fund-card-name">{props.legal_name}</div>
        <div className="diy-fund-card-info-container">
          <div className="diy-fund-card-info">
            <p>AUM: {Math.round(props.aum, 0)} Crs</p>
            <p>
              Return: <span>{props[returnField[value]]}</span>
            </p>
            <RatingStar value={props.fisdom_rating} />
          </div>
          <div
            className={
              addedToCart
                ? 'diy-fund-card-button diy-fund-card-added'
                : 'diy-fund-card-button'
            }
            role="button"
            onClick={handleCart(props)}
          >
            <img
              src={addedToCart ? remove_cart_icon : add_cart_icon}
              alt={addedToCart ? 'Add to Cart' : 'Remove from cart'}
              width="20"
            />
            <div className="action">{!addedToCart ? '+' : '-'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
