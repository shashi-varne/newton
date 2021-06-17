import React from 'react'
import Typography from '@material-ui/core/Typography'
import './InvestExploreCard.scss';

const InvestExploreCard = ({ title, description, src }) => {
  return (
    <div className="card invest-explore-card" data-aid='invest-explore-card'>
      <div className="invest-explore-meta" data-aid='invest-explore-meta'>
        <Typography variant="body1" color="primary" gutterBottom className="title">
          {title}
        </Typography>
        <Typography variant="caption" className="subtitle" data-aid='invest-explore-card-subtitle'>{description}</Typography>
      </div>
      <img src={src} alt={description} className="invest-explore-icon"/>
    </div>
  )
}

export default InvestExploreCard
