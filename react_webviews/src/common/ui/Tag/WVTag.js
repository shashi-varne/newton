import './WVTag.scss'

import React from 'react'
import PropTypes from 'prop-types'

/**
 * 
 * attention: var(--pink);
 * info: var(--mustard);
 * success: var(--lime);
 * other: var(--purple);
 * error: var(--red);
 * Sample Usage
      <WVTag
        variant="attention"
        content="free"
        dataAidSuffix="tax2win-free-tag"
        classes={{ container: 'align-self-start m-left-1x' }}
      />

      <WVTag
        variant="info"
        content={<div>akjshd</div>}
        dataAidSuffix="tax2win-free-tag"
        classes={{ container: 'align-self-start m-left-1x' }}
      />
 */
function WVTag({
  content, // content of the label or tag
  color, // color of the content. This will override the default color of content if provided.
  backgroundColor, // background color of the tag. This will override the default color of the bgColor of the tag.
  dataAidSuffix,
  variant, // Variant of the tag as specified in the design system.
  classes, // Other classes to provide.
  ...props
}) {
  return (
    <div
      className={`inline-block text-center small-text1 wv-tag wv-tag__${variant} ${classes?.container}`}
      style={{ backgroundColor, color }}
      data-aid={`wv-tag-${dataAidSuffix}`}
      {...props}
    >
      {content && (
        <Content dataAidSuffix={dataAidSuffix} classes={classes}>
          {content}
        </Content>
      )}
    </div>
  )
}

function Content({ children, classes, dataAidSuffix }) {
  return (
    <div
      className={`${classes?.content}`}
      data-aid={`wv-tag-content-${dataAidSuffix}`}
    >
      {children}
    </div>
  )
}

WVTag.propTypes = {
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.oneOf(['attention', 'info', 'success', 'other', 'error']),
  classes: PropTypes.exact({
    container: PropTypes.string,
    content: PropTypes.string,
  }),
  content: PropTypes.node.isRequired,
  props: PropTypes.object,
}

WVTag.defaultProps = {
  variant: 'attention',
  classes: {},
}

export default WVTag
