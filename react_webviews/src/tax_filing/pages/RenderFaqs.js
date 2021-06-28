import React from 'react'
import Container from '../common/Container'
import Faqs from 'common/ui/Faqs'
import { FAQs, USER_SUMMARY_KEY } from '../constants'
import { storageService } from '../../utils/validators'
import { isEmpty } from 'lodash'
import { nativeCallback } from 'utils/native_callback'
import { trackBackButtonPress } from '../common/functions'

function RenderFAQs(props) {
  const sendEvents = (userAction, data = {}) => {
    const summary = storageService().getObject(USER_SUMMARY_KEY)

    const personal_details_exist =
      !isEmpty(summary?.user?.name) &&
      !isEmpty(summary?.user?.email) &&
      !isEmpty(summary?.user?.mobile)
        ? 'yes'
        : 'no'
    const questionRead = {
      question: data?.title || '',
      answer: data?.subtitle || '',
    }

    const eventObj = {
      event_name: 'ITR',
      properties: {
        user_action: userAction,
        screen_name: 'FAQ',
        personal_details_exist,
        question_read: questionRead,
      },
    }
    if (userAction === 'just_set_events') {
      return eventObj
    } else {
      nativeCallback({ events: eventObj })
    }
  }

  const goBack = () => {
    trackBackButtonPress(props?.history?.location.pathname)
    sendEvents('back')
    props.history.goBack()
  }
  return (
    <Container
      noFooter
      title="Frequently Asked Questions"
      headerData={{ goBack }}
    >
      <div className="m-top-4x tax-filing-render-faqs-container">
        <Faqs
          options={FAQs}
          callback={(index) => {
            sendEvents('next', FAQs[index])
          }}
        />
      </div>
    </Container>
  )
}

export default RenderFAQs
