import React from 'react'

const TaxSummaryCard = ({
  openCard,
  onClick,
  hideIcon = false,
  amc_logo_small,
  exit_load,
  friendly_name,
  ltcg_tax,
  stcg_tax,
  withdrawal_amount,
}) => {
  const total_tax_liability = Math.ceil(ltcg_tax) + Math.ceil(stcg_tax)
  return (
    <section className="withdraw-tax-summary">
      <div className="top flex-between-center">
        <div className="flex-center">
          <img className="fund-image" src={amc_logo_small} alt="" />
          <div className="fund-name">{friendly_name}</div>
        </div>

        {openCard && !hideIcon && (
          <img
            className="icon"
            role="button"
            src={require(`assets/minus_icon.svg`)}
            onClick={onClick}
          />
        )}

        {!openCard && !hideIcon && (
          <img
            className="icon"
            role="button"
            src={require(`assets/plus_icon.svg`)}
            onClick={onClick}
          />
        )}
      </div>
      {openCard && (
        <div className={!openCard ? 'item item_hide' : 'item'}>
          <div className="tile flex-between-center">
            <div className="name">Withdraw Amount</div>
            <div className="value">₹ {withdrawal_amount}</div>
          </div>
          <div className="tile flex-between-center">
            <div className="name">Total tax liability</div>
            <div className="value">₹ {total_tax_liability}</div>
          </div>
          <div className="tile tile2 flex-between-center">
            <div className="name">Equity STCG tax @15%</div>
            <div className="value">₹ {Math.ceil(stcg_tax)}</div>
          </div>
          <div className="tile tile2 flex-between-center">
            <div className="name">Equity LTCG tax @10%</div>
            <div className="value">₹ {Math.ceil(ltcg_tax)}</div>
          </div>
          <div className="tile flex-between-center">
            <div className="name">Exit load</div>
            <div className="value">₹ {exit_load}</div>
          </div>
        </div>
      )}
    </section>
  )
}

export default TaxSummaryCard
