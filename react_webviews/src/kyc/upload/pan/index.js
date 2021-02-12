import React, { useState, useEffect, useRef } from 'react'
import Container from '../../common/Container'
import Alert from '../../mini_components/Alert'
import { initData } from '../../services'
import { storageService, isEmpty } from '../../../utils/validators'
import { storageConstants } from '../../constants'
import { upload } from '../../common/api'

const getTitleList = ({ kyc }) => {
  let titleList = [
    'Photo of PAN card should have your signature',
    'Photo of PAN should be clear and it should not have the exposure of flash light',
  ]
  if (
    kyc?.kyc_status !== 'compliant' &&
    kyc?.dl_docs_status !== '' &&
    kyc?.dl_docs_status !== 'init' &&
    kyc?.dl_docs_status !== null
  ) {
    if (
      kyc.all_dl_doc_statuses.pan_fetch_status === null ||
      kyc.all_dl_doc_statuses.pan_fetch_status === '' ||
      kyc.all_dl_doc_statuses.pan_fetch_status === 'failed'
    ) {
      titleList[0] =
        'Oops! seems like Digilocker is down, please upload your PAN card to proceed further'
    }
  }
  return titleList
}

const MessageComponent = (kyc) => {
  const [titleList, setTitleList] = useState(getTitleList(kyc))
  return (
    <section className="pan-alert">
      {titleList.map((title, idx) => (
        <div className="row" key={idx}>
          <div className="order">{idx + 1}.</div>
          <div className="value">{title}</div>
        </div>
      ))}
    </section>
  )
}

const Pan = () => {
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [kyc, setKyc] = useState(
    storageService().getObject(storageConstants.KYC) || null
  )

  const inputEl = useRef(null)

  useEffect(() => {
    if (isEmpty(kyc)) {
      initialize()
    }
  }, [])

  const initialize = async () => {
    try {
      setLoading(true)
      await initData()
      const kyc = storageService().getObject(storageConstants.KYC)
      setKyc(kyc)
    } catch (err) {
      console.error(err)
    } finally {
      console.log('Finally')
      setLoading(false)
    }
  }
  const handleChange = (event) => {
    console.log(event.target.files)
    setFile(event.target.files[0])
  }

  const handleUpload = () => {
    inputEl.current.click()
  }

  const handleImageLoad = (event) => {
    URL.revokeObjectURL(event.target.src)
  }

  const handleSubmit = async () => {
    try {
      setIsApiRunning(true)
      const result = await upload(file, 'pan')
      console.log(result)
      setKyc(result.kyc)
      storageService().setObject(storageConstants.KYC, result.kyc)
    } catch (err) {
      console.error(err)
    } finally {
      console.log('uploaded')
      setIsApiRunning(false)
    }
  }

  return (
    <Container
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      classOverRideContainer="pr-container"
      fullWidthButton={true}
      showSkelton={loading}
      handleClick={handleSubmit}
      disable={!file || isApiRunning}
      isApiRunning={isApiRunning}
    >
      {!isEmpty(kyc) && (
        <section id="kyc-upload-pan" className="page-body-kyc">
          <div className="title">Upload PAN</div>
          <div className="sub-title">
            PAN Card {kyc?.pan?.meta_data?.pan_number}
          </div>
          <Alert
            variant="attention"
            title="Note"
            renderMessage={() => <MessageComponent kyc={kyc} />}
          />
          <div className="kyc-doc-upload-container">
            {file && (
              <img
                src={URL.createObjectURL(file)}
                className="preview"
                alt="Uploaded PAN Card"
                onLoad={handleImageLoad}
              />
            )}
            {!file && (
              <div className="caption">Upload front side of PAN Card</div>
            )}
            <div className="kyc-upload-doc-actions">
              <input
                ref={inputEl}
                type="file"
                className="kyc-upload"
                onChange={handleChange}
              />
              <button onClick={handleUpload} className="kyc-upload-button">
                {!file && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g transform="translate(0 3)">
                      <path d="M21.4883721,0 L2.51162791,0 C1.12449412,0 0,1.11584416 0,2.49230769 L0,15.5076923 C0,16.8841558 1.12449412,18 2.51162791,18 L21.4883721,18 C22.8755059,18 24,16.8841558 24,15.5076923 L24,2.49230769 C24,1.11584416 22.8755059,0 21.4883721,0 Z M21.1219512,17 L2.87804878,17 C1.84083108,17 1,16.1078831 1,15.0074011 L1,13.1372047 L7.12780488,7 L13,13 L18,9 L23,13.8516937 L23,15.0074011 C23,16.1078831 22.1591689,17 21.1219512,17 Z M23,13 C19.7357846,9.6105021 18.0691179,7.94383544 18,8 L13,12 C9.068603,7.93471236 7.068603,5.93471236 7,6 L1,12 L1,2.92714951 C1,1.86281423 1.84083108,1 2.87804878,1 L21.1219512,1 C22.1591689,1 23,1.86281423 23,2.92714951 L23,13 Z" />
                      <path d="M13.5,2 C12.1192881,2 11,3.11928813 11,4.5 C11,5.88071187 12.1192881,7 13.5,7 C14.8807119,7 16,5.88071187 16,4.5 C16,3.11928813 14.8807119,2 13.5,2 Z M13.5,3 C14.3284271,3 15,3.67157288 15,4.5 C15,5.32842712 14.3284271,6 13.5,6 C12.6715729,6 12,5.32842712 12,4.5 C12,3.67157288 12.6715729,3 13.5,3 Z" />
                    </g>
                  </svg>
                )}
                <div className="upload-action">Open Gallery</div>
              </button>
            </div>
          </div>
        </section>
      )}
    </Container>
  )
}

export default Pan
