import React, { useEffect, useState } from 'react';
import PageHeader from '../mini-components/PageHeader';
import { getConfig } from "utils/functions";
import HoldingCard from '../mini-components/HoldingCard';
import SnapScrollContainer from '../mini-components/SnapScrollContainer';
import { holdings } from '../common/ApiCalls';
import { dummyHoldings } from './../constants';
import toast from '../../common/ui/Toast';
const isMobileView = getConfig().isMobileDevice;

const Holdings = () => {
  const [holdingsList, setHoldingsList] = useState([]);

  const fetchHoldings = async () => {
    try {
      // const result = await holdings();
      setHoldingsList(dummyHoldings);
    } catch (e) {
      console.log(e);
      toast(e);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  return (
    <div className="iwd-page" id="iwd-holdings">
      <PageHeader height={isMobileView ? '7vh' : '9vh'} hideProfile={isMobileView}>
        <>
          <div className="iwd-header-title">Holdings</div>
        </>
      </PageHeader>
      <div className="iwd-scroll-contain">
        {holdingsList.map(holding => (
          <HoldingCard {...holding} />
        ))}
      </div>
    </div>
  );
};

export default Holdings;