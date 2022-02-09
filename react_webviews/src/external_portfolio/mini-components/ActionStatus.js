import React from 'react';

const ActionStatus = ({ type, children, style = {} }) => (
  <div className="action-status" style={{ color: type === 'warning' ? '#FFBD00' : '#D04954', ...style }}>
    <img src={require(`assets/${type === 'warning' ? 'badge-warning' : 'attention_icon'}.svg`)} alt="warning" />
    <span>{children}</span>
  </div>
)

export default ActionStatus;