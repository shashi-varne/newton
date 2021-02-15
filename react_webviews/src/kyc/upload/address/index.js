import React, { useState, useEffect, useRef } from 'react'
import Container from '../../common/Container'
import Alert from '../../mini_components/Alert'
import { initData } from '../../services'
import { storageService, isEmpty } from '../../../utils/validators'
import { storageConstants, docMapper } from '../../constants'
import { upload } from '../../common/api'
import { getConfig } from '../../../utils/functions'

const getTitleList = ({ kyc }) => {
  let titleList = [
    'Photo of address card should have your signature',
    'Photo of address should be clear and it should not have the exposure of flash light',
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
        'Oops! seems like Digilocker is down, please upload your address to proceed further'
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

const AddressUpload = () => {
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [frontDoc, setFrontDoc] = useState(null)
  const [backDoc, setBackDoc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [kyc, setKyc] = useState(
    storageService().getObject(storageConstants.KYC) || null
  )

  const cameraFrontDoc = useRef(null)
  const galleryFrontDoc = useRef(null)
  const cameraBackDoc = useRef(null)
  const galleryBackDoc = useRef(null)

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
  const handleChange = (type) => (event) => {
    console.log(event.target.files)
    if (type === 'front') {
      setFrontDoc(event.target.files[0])
    } else if (type === 'back') {
      setBackDoc(event.target.files[0])
    }
  }

  const handleUpload = (ref) => () => {
    ref.current.click()
  }

  const handleImageLoad = (event) => {
    URL.revokeObjectURL(event.target.src)
  }

  // const handleSubmit = async () => {
  //   try {
  //     setIsApiRunning(true)
  //     const result = await upload(file, 'address')
  //     console.log(result)
  //     setKyc(result.kyc)
  //     storageService().setObject(storageConstants.KYC, result.kyc)
  //   } catch (err) {
  //     console.error(err)
  //   } finally {
  //     console.log('uploaded')
  //     setIsApiRunning(false)
  //   }
  // }

  const addressProofKey = kyc?.address?.meta_data?.is_nri ? 'passport' : kyc?.address_doc_type
  const addressProof = kyc?.address?.meta_data?.is_nri ? 'Passport' : docMapper[kyc?.address_doc_type]
  const onlyFrontDocRequired = ['UTILITY_BILL', 'LAT_BANK_PB'].includes(addressProofKey)

  return (
    <Container
      hideInPageTitle
      buttonTitle="SAVE AND CONTINUE"
      classOverRideContainer="pr-container"
      fullWidthButton={true}
      showSkelton={loading}
      // handleClick={handleSubmit}
      // disable={!file || isApiRunning}
      isApiRunning={isApiRunning}
    >
      {!isEmpty(kyc) && (
        <section id="kyc-upload-address" className="page-body-kyc">
          <div className="title">Upload address proof</div>
          <Alert
            variant="attention"
            title="Note"
            renderMessage={() => <MessageComponent kyc={kyc} />}
          />
          {getConfig().isMobileDevice && (
            <div className="kyc-doc-upload-container">
              {frontDoc && (
                <img
                  src={URL.createObjectURL(frontDoc)}
                  className="preview"
                  alt="Uploaded PAN Card"
                  onLoad={handleImageLoad}
                />
              )}
              {!frontDoc && (
                <div className="caption">
                  Upload front side of Address Document
                </div>
              )}
              <div className="kyc-upload-doc-actions">
                <div className="mobile-actions">
                  <div className="open-camera">
                    <input
                      ref={cameraFrontDoc}
                      type="file"
                      className="kyc-upload"
                      onChange={handleChange('front')}
                      accept="image/*"
                      capture
                    />
                    <button
                      data-click-type="camera-front"
                      onClick={handleUpload(cameraFrontDoc)}
                      className="kyc-upload-button"
                    >
                      {!frontDoc && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <g transform="translate(0 3)">
                            <path d="M17.03125,2.79581152 L16.4375,0.534031414 C16.34375,0.219895288 16.0625,0 15.71875,0 L8.28125,0 C7.9375,0 7.65625,0.219895288 7.5625,0.534031414 L6.96875,2.79581152 L2.8125,2.79581152 C1.25,2.79581152 0,4.05235602 0,5.62303665 L0,15.1727749 C0,16.7434555 1.25,18 2.8125,18 L21.1875,18 C22.75,18 24,16.7434555 24,15.1727749 L24,5.62303665 C24,4.05235602 22.75,2.79581152 21.1875,2.79581152 L17.03125,2.79581152 Z M23,5.79400749 L23,14.9026217 C23,16.071161 22.0631868,17 20.8846154,17 L3.11538462,17 C1.93681319,17 1,16.071161 1,14.9026217 L1,5.79400749 C1,4.62546816 1.93681319,3.69662921 3.11538462,3.69662921 L7.34615385,3.69662921 C7.49725275,3.69662921 7.61813187,3.60674157 7.64835165,3.48689139 L8.28296703,1.08988764 C8.28296703,1.05992509 8.34340659,1 8.37362637,1 L15.5961538,1 C15.6565934,1 15.6868132,1.02996255 15.6868132,1.08988764 L16.3214286,3.48689139 C16.3516484,3.60674157 16.4725275,3.69662921 16.6236264,3.69662921 L20.8543956,3.69662921 C22.0631868,3.69662921 23,4.62546816 23,5.79400749 Z" />
                            <path d="M12,15 C9.23076923,15 7,12.7692308 7,10 C7,7.23076923 9.23076923,5 12,5 C14.7692308,5 17,7.23076923 17,10 C17,12.7692308 14.7692308,15 12,15 Z M12,14 C14.216946,14 16,12.216946 16,10 C16,7.78305398 14.216946,6 12,6 C9.78305398,6 8,7.78305398 8,10 C8,12.216946 9.78305398,14 12,14 Z" />
                          </g>
                        </svg>
                      )}
                      <div className="upload-action">open camera</div>
                    </button>
                  </div>
                  <div className="open-gallery">
                    <input
                      ref={galleryFrontDoc}
                      type="file"
                      className="kyc-upload"
                      onChange={handleChange('front')}
                    />
                    <button
                      onClick={handleUpload(galleryFrontDoc)}
                      className="kyc-upload-button"
                    >
                      {!frontDoc && (
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
              </div>
            </div>
          )}
          {!getConfig().isMobileDevice && (
            <div className="kyc-doc-upload-container">
              {frontDoc && (
                <img
                  src={URL.createObjectURL(backDoc)}
                  className="preview"
                  alt="Uploaded PAN Card"
                  onLoad={handleImageLoad}
                />
              )}
              {!frontDoc && (
                <div className="caption">
                  Upload front side of Address Document
                </div>
              )}
              <div className="kyc-upload-doc-actions">
                <input
                  ref={galleryBackDoc}
                  type="file"
                  className="kyc-upload"
                  onChange={handleChange('back')}
                />
                <button
                  onClick={handleUpload(galleryBackDoc)}
                  className="kyc-upload-button"
                >
                  {!frontDoc && (
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
          )}
          {getConfig().isMobileDevice && !onlyFrontDocRequired && (
            <div className="kyc-doc-upload-container">
              {backDoc && (
                <img
                  src={URL.createObjectURL(backDoc)}
                  className="preview"
                  alt="Uploaded PAN Card"
                  onLoad={handleImageLoad}
                />
              )}
              {!backDoc && (
                <div className="caption">
                  Upload front side of Address Document
                </div>
              )}
              <div className="kyc-upload-doc-actions">
                <div className="mobile-actions">
                  <div className="open-camera">
                    <input
                      ref={cameraBackDoc}
                      type="file"
                      className="kyc-upload"
                      onChange={handleChange('back')}
                      accept="image/*"
                      capture
                    />
                    <button
                      data-click-type="camera-front"
                      onClick={handleUpload(cameraBackDoc)}
                      className="kyc-upload-button"
                    >
                      {!backDoc && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <g transform="translate(0 3)">
                            <path d="M17.03125,2.79581152 L16.4375,0.534031414 C16.34375,0.219895288 16.0625,0 15.71875,0 L8.28125,0 C7.9375,0 7.65625,0.219895288 7.5625,0.534031414 L6.96875,2.79581152 L2.8125,2.79581152 C1.25,2.79581152 0,4.05235602 0,5.62303665 L0,15.1727749 C0,16.7434555 1.25,18 2.8125,18 L21.1875,18 C22.75,18 24,16.7434555 24,15.1727749 L24,5.62303665 C24,4.05235602 22.75,2.79581152 21.1875,2.79581152 L17.03125,2.79581152 Z M23,5.79400749 L23,14.9026217 C23,16.071161 22.0631868,17 20.8846154,17 L3.11538462,17 C1.93681319,17 1,16.071161 1,14.9026217 L1,5.79400749 C1,4.62546816 1.93681319,3.69662921 3.11538462,3.69662921 L7.34615385,3.69662921 C7.49725275,3.69662921 7.61813187,3.60674157 7.64835165,3.48689139 L8.28296703,1.08988764 C8.28296703,1.05992509 8.34340659,1 8.37362637,1 L15.5961538,1 C15.6565934,1 15.6868132,1.02996255 15.6868132,1.08988764 L16.3214286,3.48689139 C16.3516484,3.60674157 16.4725275,3.69662921 16.6236264,3.69662921 L20.8543956,3.69662921 C22.0631868,3.69662921 23,4.62546816 23,5.79400749 Z" />
                            <path d="M12,15 C9.23076923,15 7,12.7692308 7,10 C7,7.23076923 9.23076923,5 12,5 C14.7692308,5 17,7.23076923 17,10 C17,12.7692308 14.7692308,15 12,15 Z M12,14 C14.216946,14 16,12.216946 16,10 C16,7.78305398 14.216946,6 12,6 C9.78305398,6 8,7.78305398 8,10 C8,12.216946 9.78305398,14 12,14 Z" />
                          </g>
                        </svg>
                      )}
                      <div className="upload-action">open camera</div>
                    </button>
                  </div>
                  <div className="open-gallery">
                    <input
                      ref={galleryBackDoc}
                      type="file"
                      className="kyc-upload"
                      onChange={handleChange('back')}
                    />
                    <button
                      onClick={handleUpload(galleryBackDoc)}
                      className="kyc-upload-button"
                    >
                      {!backDoc && (
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
              </div>
            </div>
          )}
          {!getConfig().isMobileDevice && !onlyFrontDocRequired && (
            <div className="kyc-doc-upload-container">
              {backDoc && (
                <img
                  src={URL.createObjectURL(backDoc)}
                  className="preview"
                  alt="Uploaded PAN Card"
                  onLoad={handleImageLoad}
                />
              )}
              {!backDoc && (
                <div className="caption">Back side of Address Document</div>
              )}
              <div className="kyc-upload-doc-actions">
                <input
                  ref={galleryBackDoc}
                  type="file"
                  className="kyc-upload"
                  onChange={handleChange('back')}
                />
                <button
                  onClick={handleUpload(galleryBackDoc)}
                  className="kyc-upload-button"
                >
                  {!backDoc && (
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
          )}
        </section>
      )}
    </Container>
  )
}

export default AddressUpload
