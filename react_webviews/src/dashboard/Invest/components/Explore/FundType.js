import React,{useState} from 'react'
import Container from '../../../common/Container'
import Typography from '@material-ui/core/Typography'
import Button from 'common/ui/Button'
import { storageService } from 'utils/validators'
import heart_icon from 'assets/trending_heart_icon.png'
import { CART } from '../../../DIY/constants'
import DiyCartButton from '../../../DIY/mini-components/CartButton'
import Cart from '../../../DIY/mini-components/Cart'
import './FundType.scss';

import { nativeCallback } from '../../../../utils/native_callback'
import { flowName } from '../../constants'
import { getConfig, navigate as navigateFunc } from '../../../../utils/functions'

const config = getConfig();
const isMobileDevice = config.isMobileDevice;
const TrendingCard = ({ cart, setCart, type, parentProps, ...props }) => {
  const navigate = navigateFunc.bind(parentProps);
  const handleNavigate = (data) => {
    let dataCopy = Object.assign({}, data);
    dataCopy.category = "scheme carousel";
    dataCopy.diy_type = type;
    storageService().setObject("diystore_fundInfo", dataCopy);
    navigate(
      `/fund-details`,
      { searchParams: `${parentProps.location.search}&isins=${props.isin}&type=diy` }
    )
  }
  const handleAddToCart = () => {
    setCart((cart) => {
      const index = cart.findIndex(({ isin }) => props.isin === isin)
      if (index !== -1) {
        const updatedCart = cart.filter(({ isin }) => isin !== props.isin)
        setCart(updatedCart)
        storageService().setObject(CART, updatedCart)
      } else {
        const updatedCart = [...cart, props]
        setCart(updatedCart)
        storageService().setObject(CART, updatedCart)
      }
    })
  }
  const addedToCart = cart.find(({ isin }) => isin === props.isin)
  return (
    <div className="item">
      <div className="item-details">
        <Typography color="primary" className="title" onClick={() => handleNavigate(props)}>
          {props.legal_name}
        </Typography>
        <img src={props.amc_logo_big} alt="name" width="80" />
      </div>
      <div className="cart-actions">
        <div className="stats">
          <img
            src={heart_icon}
            alt={`${props.purchase_percent}% investors like this`}
            width="15"
          />
          <article className="desc">
            {props.purchase_percent}% investors
          </article>
        </div>
        <Button
          disable={addedToCart ? true : false}
          onClick={handleAddToCart}
          classes={{
            button: "invest-explore-trending-button"
          }}
          buttonTitle={addedToCart ? 'Added' : 'Add to Cart'}
        />
      </div>
    </div>
  )
}

const CategoryCard = ({ label, name, trivia, sendEvents, icon, type, ...props }) => {
  const navigate = navigateFunc.bind(props)
  const handleNavigate = () => {
    sendEvents('next', name)
    navigate(
      `/diy/fundlist/${type}/${label}`,
      {state: {
        name: name
      }},
    )
  }

  return (
    <div className="card" onClick={handleNavigate}>
      <img src={icon} alt={name} className="icon" />
      <Typography variant="title" color="primary" className="name" gutterBottom>
        {name}
      </Typography>
      <Typography variant="caption">{trivia}</Typography>
    </div>
  )
}

const FundType = (props) => {
  const type = props.match.params?.type.toLowerCase()
  const [cart, setCart] = useState(storageService().getObject(CART) || [])
  const [cartActive, setCartActive] = useState(false)
  const trendingFunds = storageService().getObject('diystore_trending') || [];
  const categories = storageService().getObject('diystore_categoryList') || [];
  const { sub_categories } = categories?.find(
    (el) => el.category.toLowerCase() === type
  ) || [];
  const initialCartCount = (storageService().getObject(CART))?.length

  const sendEvents = (userAction, cardClicked, cartCount, fundName) => {
    let eventObj = {
      event_name: "mf_investment",
      properties:
        cardClicked !== "card_bottom_sheet"
          ? {
              "screen_name": "scheme type categories",
              "user_action": userAction || "",
              "primary_category": "scheme type category" || "",
              "card_clicked": cardClicked || "",
              "scheme_type": props.match.params?.type || "",
              "add_to_cart": cart.length || "none",
              "additonal_cart_value": cart.length - initialCartCount || 0,
              "flow": "diy",
            }
          : {
              "userAction": userAction,
              "fund_name": fundName || "",
              "screen_name": cardClicked || "",
              "flow": flowName['diy'],
              "cart_count": cartCount,
            },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      classOverRIde="pr-error-container"
      noFooter
      title={props.match.params?.type || ""}
      classOverRideContainer="pr-container"
      data-aid='fund-type-screen'
    >
      <section id="invest-explore-fund-type" data-aid='invest-explore-fund-type'>
        {trendingFunds[type]?.length > 0 && <h6 className="heading top-title">Top trending {type} funds</h6>}
        <div className="scroll">
          {trendingFunds[type]?.map((fund, idx) => (
            <TrendingCard key={idx} cart={cart} setCart={setCart} type={type} {...fund} parentProps={props} />
          ))}
        </div>
        <section className="categories">
          <h6 className="heading">Categories</h6>
          <div className="categories-container">
            {sub_categories?.map((category, idx) => (
              <CategoryCard
                key={idx}
                label={category.key}
                name={category.name}
                trivia={category.trivia}
                sendEvents={sendEvents}
                icon={require(`assets/${config.productName}/${category.key}.svg`)}
                type={type}
                {...props}
              />
            ))}
          </div>
        </section>
      </section>
      {config.productName !== "finity" && (
        <footer
          className="diy-cart-footer"
          style={{ marginLeft: isMobileDevice && 0 }}
        >
          {cart.length > 0 && (
            <DiyCartButton
              className="button"
              onClick={() => {sendEvents('cart'); setCartActive(true)}}
              cartlength={cart.length}
            />
          )}

          <Cart
            isOpen={cartActive && cart.length > 0}
            setCartActive={setCartActive}
            cart={cart}
            setCart={setCart}
            sendEvents={sendEvents}
            {...props}
          />
        </footer>
      )}
    </Container>
  )
}

export default FundType
