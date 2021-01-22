import React from 'react'
import Container from '../../../../fund_details/common/Container'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {storageService} from "utils/validators"
import heart_icon from 'assets/trending_heart_icon.png'
import overnight_icon from 'assets/fisdom/Overnight.svg'

const TrendingCard = ({ name, src, likePercentage }) => {
  return (
    <div className="item">
      <div className="item-details">
        <Typography color="primary" className="title">
          {name}
        </Typography>
        <img src={src} alt="name" width="80" />
      </div>
      <div className="cart-actions">
        <div className="stats">
          <img
            src={heart_icon}
            alt={`${likePercentage}% investors like this`}
            width="15"
          />
          <article className="desc">{likePercentage}% investors</article>
        </div>
        <Button color="secondary" variant="raised">
          Add to Cart
        </Button>
      </div>
    </div>
  )
}

const CategoryCard = ({ name, duration, icon }) => {
  return (
    <div className="card">
      <img src={icon} alt={name} className="icon" />
      <Typography variant="title" color="primary" className="name" gutterBottom>
        {name}
      </Typography>
      <Typography variant="caption">{duration}</Typography>
    </div>
  )
}
const trends = [
  {
    name: 'ICICI Prudential Liquid Growth Fund',
    src:
      'https://sdk-dot-plutus-staging.appspot.com/static/img/amc-logo/low-res/icici_new.png',
    likePercentage: 34,
  },
  {
    name: 'ICICI Prudential Liquid Growth Fund',
    src:
      'https://sdk-dot-plutus-staging.appspot.com/static/img/amc-logo/low-res/icici_new.png',
    likePercentage: 34,
  },
  {
    name: 'ICICI Prudential Liquid Growth Fund',
    src:
      'https://sdk-dot-plutus-staging.appspot.com/static/img/amc-logo/low-res/icici_new.png',
    likePercentage: 34,
  },
  {
    name: 'ICICI Prudential Liquid Growth Fund',
    src:
      'https://sdk-dot-plutus-staging.appspot.com/static/img/amc-logo/low-res/icici_new.png',
    likePercentage: 34,
  },
]

const categories = [
  { name: 'Overnight', duration: 'For a day', icon: overnight_icon },
  { name: 'Overnight', duration: 'For a day', icon: overnight_icon },
  { name: 'Overnight', duration: 'For a day', icon: overnight_icon },
  { name: 'Overnight', duration: 'For a day', icon: overnight_icon },
  { name: 'Overnight', duration: 'For a day', icon: overnight_icon },
  { name: 'Overnight', duration: 'For a day', icon: overnight_icon },
  { name: 'Overnight', duration: 'For a day', icon: overnight_icon },
  { name: 'Overnight', duration: 'For a day', icon: overnight_icon },
  { name: 'Overnight', duration: 'For a day', icon: overnight_icon },
  { name: 'Overnight', duration: 'For a day', icon: overnight_icon },
]
const FundType = ({match}) => {

  const type = match.params?.type.toLowerCase();
  const trendingFunds = storageService().getObject('diystore_trending');
  const categories = storageService().getObject('diystore_categoryList');
  const {sub_categories} = categories?.find(el => el.category.toLowerCase() === type);
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
          {trendingFunds[type]?.map(({ legal_name, amc_logo_big, purchase_percent }, idx) => (
            <TrendingCard key={idx} name={legal_name} src={amc_logo_big} likePercentage={purchase_percent} />
          ))}
        </div>
        <section className="categories">
          <h6 className="heading">Categories</h6>
          <div className="categories-container">
            {sub_categories?.map(({ name, trivia, idx ,key}) => (
              <CategoryCard key={idx} name={name} duration={trivia} icon={require(`assets/fisdom/${key}.svg`)} />
            ))}
          </div>
        </section>
      </section>
    </Container>
  )
}

export default FundType
