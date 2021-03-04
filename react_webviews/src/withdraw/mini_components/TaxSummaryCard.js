import React from 'react'

const TaxSummaryCard = ({
  open = true,
  toggle,
  withdrawable_amount,
  hideIcon = false,
}) => {
  return (
    <section className="withdraw-tax-summary">
      <div className="top flex-between-center">
        <div className="flex-center">
          <img
            className="fund-image"
            src={
              'https://my.fisdom.com/static/img/amc-logo/low-res/nippon_india.png'
            }
            alt=""
          />
          <div className="fund-name">{'ICICI Pru Liquid Fund (G)'}</div>
        </div>

        {open && !hideIcon ? (
          <img
            className="icon"
            src={require(`assets/minus_icon.svg`)}
            onClick={toggle}
          />
        ) : !open && !hideIcon ? (
          <img
            className="icon"
            src={require(`assets/plus_icon.svg`)}
            onClick={toggle}
          />
        ) : null}
      </div>
      <div className={!open ? 'item_hide' : 'item'}>
        <div className="tile flex-between-center">
          <div className="name">Withdraw Amount</div>
          <div className="value">₹ 2000</div>
        </div>
        <div className="tile flex-between-center">
          <div className="name">Total tax liability</div>
          <div className="value">₹ 52</div>
        </div>
        <div className="tile tile2 flex-between-center">
          <div className="name">Equity STCG tax @15%</div>
          <div className="value">₹ 0</div>
        </div>
        <div className="tile tile2 flex-between-center">
          <div className="name">Equity LTCG tax @10%</div>
          <div className="value">₹ 52</div>
        </div>
        <div className="tile flex-between-center">
          <div className="name">Exit load</div>
          <div className="value">₹ 0</div>
        </div>
      </div>
    </section>
  )
}

export default TaxSummaryCard
