import React, { useState, useEffect } from 'react'
import Container from '../../common/Container'
import Disclaimer from './Disclaimer'
import TaxSummaryCard from '../../mini-components/TaxSummaryCard'
import { Redirect } from 'react-router-dom'
import toast from 'common/ui/Toast'
import ExitLoad from './ExitLoad'
import TaxLiability from './TaxLiability'
import { getTaxes, redeemOrders } from '../../common/Api'
import { isEmpty } from 'utils/validators'
import { getConfig } from 'utils/functions'
import { navigate as navigateFunc } from '../../common/commonFunction'
import { formatAmountInr } from '../../../utils/validators'

import '../commonStyles.scss';
import './System.scss';

const SystemSummary = (props) => {
  const navigate = navigateFunc.bind(props)
  const [taxes, setTaxes] = useState('')
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
      const result = await redeemOrders('system', {
        investments: [{ ...props.location.state }],
      })

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
      const taxes = await getTaxes(props?.location?.state?.amounts);
      setTaxes(taxes)
      const firstIsin = taxes?.liabilities[0]?.isin || "";
      setOpen((open) => {
        return { ...open, [firstIsin]: true }
      })
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const showOpenCard = (isin) => {
    if(taxes?.liabilities?.length === 1) return;
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
  return (
    <Container
      data-aid='system-summary-screen'
      buttonTitle={'CONTINUE'}
      fullWidthButton
      classOverRideContainer="pr-container"
      classOverRide="withdraw-two-button"
      hidePageTitle
      handleClick={handleClick}
      skelton={isEmpty(taxes)}
      showLoader={isApiRunning}
      buttonData={{
        leftTitle: "Withdraw amount",
        leftSubtitle: formatAmountInr(getTotalAmount()),
      }}
      type="withProvider"
    >
      {!isEmpty(taxes) && (
        <section id="withdraw-system-summary" data-aid='withdraw-system-summary'>
          <TaxLiability stcg={taxes?.stcg_tax} ltcg={taxes?.ltcg_tax} />
          <ExitLoad exit_load={taxes.exit_load} />
          <div className="tax-summary">Tax Summary</div>
          <main className="fund-list" data-aid='fund-list'>
            {taxes?.liabilities?.map((item) => (
              <TaxSummaryCard
                key={item.isin}
                {...item}
                openCard={
                  open[item.isin]
                }
                onClick={() => {
                  showOpenCard(item.isin)
                }}
                hideIcon={taxes?.liabilities?.length === 1}
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

export default SystemSummary
