import './HowWeRecommend.scss';
import React from 'react';
import { capitalize, getConfig } from '../../utils/functions';
import Container from '../common/Container';

const HowWeRecommend = (props) => {
  const { productName } = getConfig();
  return (
    <Container
      buttonTitle="GO BACK"
      title='How we recommend funds'
      handleClick={() => props.history.goBack()}
      hidePageTitle
      data-aid='how-we-recommend-funds-screen'
    >
      <div className="risk_profiler-recommendation" data-aid='risk-profiler-recommendation'>
        <h1 className="risk_profiler-heading">How we recommend funds?</h1>
        <p className="risk_profiler-desc">
            We have a robust and tested research methodology to recommend the best
            set of funds to you.
        </p>
        <div className="risk_profiler-points" data-aid='risk-profiler-points'>
          <h1 className="risk_profiler-points-heading">We take into account</h1>
          <div className="risk_profiler-point" data-aid='risk_profiler-point-1'>
            <img src={require(`assets/${productName}/rec_point1.svg`)} alt="" className="risk_profiler-point-img" />
            <p className="risk_profiler-point-des">Minimum 3-5 years track record</p>
          </div>
          <div className="risk_profiler-point" data-aid='risk_profiler-point-2'>
            <img src={require(`assets/${productName}/rec_point2.svg`)} alt="" className="risk_profiler-point-img" />
            <p className="risk_profiler-point-des">
                Performance and returns over multiple time horizons - 6 months, 1
                year, 3 years and 5 years
            </p>
          </div>
          <div className="risk_profiler-point" data-aid='risk_profiler-point-3'>
            <img src={require(`assets/${productName}/rec_point3.svg`)} alt="" className="risk_profiler-point-img" />
            <p className="risk_profiler-point-des">
                Performance in bull and bear markets, and during upward and downward
                movement of interest rates
            </p>
          </div>
          <div className="risk_profiler-point" data-aid='risk_profiler-point-4'>
            <img src={require(`assets/${productName}/rec_point4.svg`)} alt="" className="risk_profiler-point-img" />
            <p className="risk_profiler-point-des">
                Performance of fund manager in other schemes and over time
            </p>
          </div>
          <div className="risk_profiler-point" data-aid='risk_profiler-point-5'>
            <img src={require(`assets/${productName}/rec_point5.svg`)} alt="" className="risk_profiler-point-img" />
            <p className="risk_profiler-point-des">
                In case of debt, less or more exposure to the yield curve, based on
                the tenure of the investment
            </p>
          </div>
          <div className="risk_profiler-point" data-aid='risk_profiler-point-6'>
            <img src={require(`assets/${productName}/rec_point6.svg`)} alt="" className="risk_profiler-point-img" />
            <p className="risk_profiler-point-des">
                Your risk taking ability and willingness as calculated by {capitalize(productName)}'s
                proprietary profiler
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HowWeRecommend;