// ----------------- Assets ----------------------
import IlsWip from 'assets/fisdom/ils_wip.svg';
import IlsWipMob from 'assets/fisdom/ils_wip_mob.svg';
// -----------------------------------------------
import React from 'react';
import ErrorScreen from '../../common/responsive-components/ErrorScreen';
import { getConfig } from "utils/functions";
import PageHeader from '../mini-components/PageHeader';

const isMobileView = getConfig().isMobileDevice;

const Recommendations = () => {
  return (
    <div className="iwd-page">
      <PageHeader>
        <div className="iwd-header-title">Recommendations</div>
      </PageHeader>
      <ErrorScreen
        classes={{
          container: 'iwd-fade'
        }}
        useTemplate={true}
        templateImage={isMobileView ? IlsWipMob : IlsWip}
        templateErrText="We are in a process of building something best for you, with this you can easily rebalance your funds as per the market ongoings."
      />
    </div>
  );
};

export default Recommendations;