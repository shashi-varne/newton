import React from 'react';
import ic_pa_b1 from 'assets/ic_pa_b1.svg';
import ic_pa_b2 from 'assets/ic_pa_b2.svg';
import ic_pa_b3 from 'assets/ic_pa_b3.svg';
import ic_pa_b4 from 'assets/ic_pa_b4.svg';
import ic_pa_b5 from 'assets/ic_pa_b5.svg';

const Plan1 = () => {
  return (
    <div className="plan-details">
      <div style={{ display: 'flex', alignItems: 'center', paddingTop: '15px', paddingBottom: '15px' }}>
        <img src={ic_pa_b1} alt="" style={{ marginRight: '15px' }} />
        <div>
          <div style={{ color: '#160d2e', fontSize: '14px', lineHeight: '22px' }}>Lumpsum pay out to your family in case of accidental death</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', paddingTop: '15px', paddingBottom: '15px' }}>
        <img src={ic_pa_b2} alt="" style={{ marginRight: '15px' }} />
        <div>
          <div style={{ color: '#160d2e', fontSize: '14px', lineHeight: '22px' }}>Get yourself covered for permanent total or partial disablement</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', paddingTop: '15px', paddingBottom: '15px' }}>
        <img src={ic_pa_b3} alt="" style={{ marginRight: '15px' }} />
        <div>
          <div style={{ color: '#160d2e', fontSize: '14px', lineHeight: '22px' }}>Protection against accidental burns</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', paddingTop: '15px', paddingBottom: '15px' }}>
        <img src={ic_pa_b4} alt="" style={{ marginRight: '15px' }} />
        <div>
          <div style={{ color: '#160d2e', fontSize: '14px', lineHeight: '22px' }}>Allowances for ambulance and last rites (Select higher plans to get this benefit)</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', paddingTop: '15px', paddingBottom: '15px' }}>
        <img src={ic_pa_b5} alt="" style={{ marginRight: '15px' }} />
        <div>
          <div style={{ color: '#160d2e', fontSize: '14px', lineHeight: '22px' }}>Allowances for purchase of blood (Select higher plans to get this benefit)</div>
        </div>
      </div>
    </div>
  );
}

const Plan2 = () => {
  return (
    <div className="plan-details">
      <div style={{ display: 'flex', alignItems: 'center', paddingTop: '15px', paddingBottom: '15px' }}>
        <img src={ic_pa_b1} alt="" style={{ marginRight: '15px' }} />
        <div>
          <div style={{ color: '#160d2e', fontSize: '14px', lineHeight: '22px' }}>Lumpsum pay out to your family in case of accidental death</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', paddingTop: '15px', paddingBottom: '15px' }}>
        <img src={ic_pa_b2} alt="" style={{ marginRight: '15px' }} />
        <div>
          <div style={{ color: '#160d2e', fontSize: '14px', lineHeight: '22px' }}>Get yourself covered for permanent total or partial disablement</div>
        </div>
      </div>
    </div>
  );
}

export {
  Plan1,
  Plan2
}