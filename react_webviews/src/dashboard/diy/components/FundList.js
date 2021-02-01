import React, { useEffect, useState } from 'react'
import Container from '../../../fund_details/common/Container'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import RatingStar from '../../../fund_details/common/RatingStar'
import './style.scss'
import { storageService } from '../../../utils/validators'

import { navigate as navigateFunc } from '../../invest/common/commonFunction'

import CartFooter from '../components/CartFooter'
import { getFundList } from '../functions'
import {
  CART,
  FUNDOPTION,
  FUNDSLIST,
  SORTFILTER,
  FUNDHOUSE,
  CART_LIMIT,
  CATEGORY,
  SUBCATEGORY,
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
const FundList = (props) => {
  const { match, classes, ...parentProps } = props
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
    const { key, type } = match.params
    const category = storageService().get(CATEGORY)
    const subCategory = storageService().get(SUBCATEGORY)
    if (!category || !subCategory || category !== type || subCategory !== key || fundsList.length === 0) {
      fetchFunds({ key, type })
    }
  }, [])

  useEffect(() => {
    const { key, type } = match.params
    const category = storageService().get(CATEGORY)
    const subCategory = storageService().get(SUBCATEGORY)
    if (!category || !subCategory || category !== type || subCategory !== key || fundsList.length === 0) {
      fetchFunds({ key, type })
    }
  }, [match.params.key, match.params.type])

  const fetchFunds = async ({ key, type }) => {
    try {
      setShowLoader(true)
      const funds = await getFundList({ key, type })
      setFundsList([...funds])
      storageService().setObject(FUNDSLIST, funds)
      storageService().set(CATEGORY, type)
      storageService().set(SUBCATEGORY, key)
    } catch (err) {
      console.log('Error', err.message)
      storageService().remove(CATEGORY)
      storageService().remove(SUBCATEGORY)
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
      title={
        match.params.type.charAt(0).toUpperCase() + match.params.type.slice(1)
      }
      showLoader={showLoader}
      classOverRideContainer="pr-containe>r"
      id="diy-fundlist-container"
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
                return (
                  item.hasOwnProperty(returnField[value]) &&
                  item.three_year_return !== null &&
                  item.growth_or_dividend === fundOption &&
                  item.sip === true
                )
              }

              return (
                item.hasOwnProperty(returnField[value]) &&
                item.three_year_return !== null &&
                item.growth_or_dividend === fundOption &&
                item.sip === true &&
                item.fund_house === fundHouse
              )
            })
            .sort((a, b) => {
              if (sortFilter === 'returns') {
                return Number(b[returnField[value]]) -
                  Number(a[returnField[value]]) >
                  0
                  ? 1
                  : -1
              }
              if (sortFilter === 'rating') {
                return Number(b.fisdom_rating) - Number(a.fisdom_rating) > 0
                  ? 1
                  : -1
              }
              if (sortFilter === 'fundsize') {
                return Number(b.aum) - Number(a.aum) > 0 ? 1 : -1
              }
            })
            .map((item) => (
              <DiyFundCard
                key={item.isin}
                {...item}
                value={value}
                handleCart={handleCart}
                addedToCart={cart.map(({ isin }) => isin).includes(item.isin)}
                parentProps={parentProps}
              />
            ))}
        </TabContainer>
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
        {...parentProps}
      />
    </Container>
  )
}

export default FundList

const DiyFundCard = ({
  value,
  handleCart,
  addedToCart,
  parentProps,
  ...props
}) => {
  const handleClick = () => {
    const navigate = navigateFunc.bind(parentProps)
    console.log(parentProps.location.search + '&isins=' + props.isin)
    navigate(
      `/fund-details`,
      {
        searchParams: `${parentProps.location.search}&isins=${props.isin}&type=diy`,
      },
      true
    )
  }
  return (
    <div className="diy-fund-card">
      <div className="diy-fund-card-img">
        <img
          src={props.amc_logo_small}
          alt="some"
          width="90"
          onClick={handleClick}
        />
      </div>
      <div className="diy-fund-card-details">
        <div className="diy-fund-card-name" onClick={handleClick}>
          {props.legal_name}
        </div>
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
