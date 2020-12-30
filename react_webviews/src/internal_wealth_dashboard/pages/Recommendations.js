// ----------------- Assets ----------------------
import IlsWip from 'assets/fisdom/ils_wip.svg';
import IlsWipMob from 'assets/fisdom/ils_wip_mob.svg';
// -----------------------------------------------
import React from 'react';
import IwdErrorScreen from '../mini-components/IwdErrorScreen';
import { getConfig } from "utils/functions";
import PageHeader from '../mini-components/PageHeader';

const isMobileView = getConfig().isMobileDevice;

const Recommendations = () => {
  return (
    <div className="iwd-page">
      <PageHeader>
        <div className="iwd-header-title">Recommendations</div>
      </PageHeader>
      <IwdErrorScreen
        templateImage={isMobileView ? IlsWipMob : IlsWip}
        templateErrText="We’re in the process of building a range of value-added services to enhance your investment experience. Stay tuned!"
      />
    </div>
  );
};

export default Recommendations;