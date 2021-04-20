import React, { useState, useEffect } from 'react'
import Container from '../../common/Container'
import Disclaimer from './Disclaimer'
import TaxSummaryCard from '../../mini_components/TaxSummaryCard'
import { Redirect } from 'react-router-dom'
import toast from 'common/ui/Toast'
import { getTaxes, redeemOrders } from '../../common/Api'
import { isEmpty } from 'utils/validators'
import { getConfig } from 'utils/functions'
import { navigate as navigateFunc } from '../../common/commonFunction'
import { formatAmountInr } from '../../../utils/validators'

const TaxLiability = (props) => {
  const { stcg, ltcg } = props
  return (
    <section className="withdraw-summary-liability Card">
      <div className="title">Tax liability</div>
      <main className="breakdown">
        <div className="item flex-between-center">
          <div className="name">STCG tax**</div>
          <div className="value">₹ {stcg}</div>
        </div>
        <div className="item flex-between-center">
          <div className="name">LTCG tax**</div>
          <div className="value">₹ {ltcg}</div>
        </div>
      </main>
      <hr className="ruler" />
      <footer className="total flex-between-center">
        <div className="name">Total tax</div>
        <div className="value">₹ {stcg + ltcg}</div>
      </footer>
    </section>
  )
}

const ExitLoad = ({ exit_load }) => {
  return (
    <section className="withdraw-summary-exitload Card">
      <div className="title">Exit Load</div>
      <div className="total flex-between-center">
        <div className="name">Exit load</div>
        <div className="value">₹ {exit_load || 0}</div>
      </div>
    </section>
  )
}

const SelfSummary = (props) => {
  const navigate = navigateFunc.bind(props)
  const [taxes, setTaxes] = useState(taxes)
  const [open, setOpen] = useState({})
  const [isApiRunning, setIsApiRunning] = useState(false)

  if (!props?.location?.state?.amounts) {
    return (
      <Redirect
        to={{
          pathname: '/withdraw',
          search: getConfig().searchParams,
        }}
      />
    )
  }

  const handleClick = async () => {
    try {
      setIsApiRunning("button")
      // const itype = props?.location?.state?.itype
      // const subtype = props?.location?.state?.subtype
      // const name = props?.location?.state?.name
      // const allocations = Object.keys(props?.location?.state?.amounts).reduce(
      //   (acc, cur) => {
      //     return [
      //       ...acc,
      //       { mfid: cur, amount: props?.location?.state?.amounts[cur] },
      //     ]
      //   },
      //   []
      // )
      const result = await redeemOrders('system', {
        investments: [{ ...props.location.state }],
      })
      console.log(result)

      if (result?.resend_redeem_otp_link && result?.verification_link) {
        navigate('verify', {state:{...result} })
        return
      }
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setIsApiRunning(false)
    }
  }

  const fetchTaxes = async () => {
    try {
      const taxes = await getTaxes(props?.location?.state?.amounts)
      setTaxes(taxes)
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const showOpenCard = (isin) => {
    setOpen((open) => {
      return { ...open, [isin]: !!!open[isin] }
    })
  }

  const getTotalAmount = () =>
    Object.values(props?.location?.state?.amounts).reduce(
      (acc, cur) => (acc += cur),
      0
    ) || 0

  useEffect(() => {
    fetchTaxes()
  }, [])
  console.log(taxes)
  return (
    <Container
      buttonTitle={'CONTINUE'}
      fullWidthButton
      classOverRideContainer="pr-container"
      classOverRide="withdraw-two-button"
      hidePageTitle
      handleClick={handleClick}
      skelton={isEmpty(taxes)}
      // twoButton={true}
      // footerText1={getTotalAmount()}
      // isApiRunning={isApiRunning}
      showLoader={isApiRunning}
      buttonData={{
        leftTitle: "Withdraw amount",
        leftSubtitle: formatAmountInr(getTotalAmount()),
      }}
      type="withProvider"
    >
      {!isEmpty(taxes) && (
        <section id="withdraw-system-summary">
          <TaxLiability stcg={taxes?.stcg_tax} ltcg={taxes?.ltcg_tax} />
          <ExitLoad exit_load={taxes.ltcg} />
          <div className="tax-summary">Tax Summary</div>
          <main className="fund-list">
            {taxes?.liabilities?.map((item, idx) => (
              <TaxSummaryCard
                key={item.isin}
                {...item}
                openCard={
                  idx === 0
                    ? isEmpty(open[item.isin])
                      ? true
                      : open[item.isin]
                    : open[item.isin]
                }
                onClick={() => {
                  showOpenCard(item.isin)
                }}
              />
            ))}
          </main>
          {taxes?.extra_messages && (
            <Disclaimer disclaimers={taxes?.extra_messages} />
          )}
        </section>
      )}
    </Container>
  )
}

export default SelfSummary
