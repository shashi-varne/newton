import React,{useState} from 'react'
import Container from '../../../common/Container'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { storageService } from 'utils/validators'
import heart_icon from 'assets/trending_heart_icon.png'
import { CART } from '../../../diy/constants'
import DiyCartButton from '../../../diy/components/CartButton'
import Cart from '../../../diy/components/Cart'

import { navigate as navigateFunc } from '../../common/commonFunction'

const TrendingCard = ({ cart, setCart, parentProps, ...props }) => {
  const navigate = navigateFunc.bind(parentProps)
  const handleNavigate = () => {
    navigate(
      `/fund-details`,
      { searchParams: `${parentProps.location.search}&isins=${props.isin}` },
      true
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
        <Typography color="primary" className="title" onClick={handleNavigate}>
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
          color="secondary"
          variant="raised"
          onClick={handleAddToCart}
          disabled={addedToCart ? true : false}
        >
          {addedToCart ? 'Added' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  )
}

const CategoryCard = ({ label, name, trivia, icon, type, ...props }) => {
  const navigate = navigateFunc.bind(props)
  const handleNavigate = () => {
    console.log(props.location.search)
    navigate(
      `/diy/fundlist/${type}/${label}`,
      null,
      true,
      props.location.search
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
  const trendingFunds = storageService().getObject('diystore_trending')
  const categories = storageService().getObject('diystore_categoryList')
  const { sub_categories } = categories?.find(
    (el) => el.category.toLowerCase() === type
  )
  return (
    <Container
      classOverRIde="pr-error-container"
      noFooter
      helpContact
      hideInPageTitle
      title="Explore All Mutual Funds"
      classOverRideContainer="pr-container"
    >
      <section id="invest-explore-fund-type">
        <h6 className="heading">Top trending {type} funds</h6>
        <div className="scroll">
          {trendingFunds[type]?.map((fund, idx) => (
            <TrendingCard key={idx} cart={cart} setCart={setCart} {...fund} parentProps={props} />
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
                icon={require(`assets/fisdom/${category.key}.svg`)}
                type={type}
                {...props}
              />
            ))}
          </div>
        </section>
      </section>
      <footer className="diy-cart-footer">
        {cart.length > 0 && (
          <DiyCartButton
            className="button"
            onClick={() => setCartActive(true)}
            cartlength={cart.length}
          />
        )}

        <Cart
          isOpen={cartActive && cart.length > 0}
          setCartActive={setCartActive}
          cart={cart}
          setCart={setCart}
          {...props}
        />
      </footer>
    </Container>
  )
}

export default FundType
