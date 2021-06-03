import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import Container from '../../common/Container'
import TaxSummaryCard from '../../mini-components/TaxSummaryCard'
import { disclaimers } from '../../constants'
import Disclaimer from './Disclaimer'
import toast from 'common/ui/Toast'
import { getTaxes, redeemOrders } from '../../common/Api'
import { formatAmountInr, isEmpty } from '../../../utils/validators'
import { getConfig, navigate as navigateFunc } from '../../../utils/functions'

import './Insta.scss';
import '../commonStyles.scss';

const Insta = (props) => {
  const navigate = navigateFunc.bind(props)
  const [taxes, setTaxes] = useState('');
  const [open, setOpen] = useState({})
  const [isApiRunning, setIsApiRunning] = useState(false)

  if (!props?.location?.state?.amounts) {
    return <Redirect to={`/withdraw${getConfig().searchParams}`} />
  }

  const handleClick = async () => {
    try {
      setIsApiRunning("button")
      const itype = props?.location?.state?.itype
      const subtype = props?.location?.state?.subtype
      const name = props?.location?.state?.name
      const allocations = Object.keys(props?.location?.state?.amounts).reduce(
        (acc, cur) => {
          return [
            ...acc,
            { mfid: cur, amount: props?.location?.state?.amounts[cur] },
          ]
        },
        []
      )
      const result = await redeemOrders('insta_redeem', {
        investments: [{ itype, name, subtype, allocations }],
      })
      if (result?.resend_redeem_otp_link && result?.verification_link) {
        navigate('/withdraw/verify', { state:{...result} })
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
        <>
          <section id="withdraw-insta-summary">
            <div className="title">Tax Summary</div>
            <main className="fund-list">
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
          <Disclaimer disclaimers={disclaimers} />
        </>
      )}
    </Container>
  )
}

export default Insta
