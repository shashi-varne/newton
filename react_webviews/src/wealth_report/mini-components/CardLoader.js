import React from 'react';
import { CircularProgress } from 'material-ui';

export default function CardLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "300px",
        clear: "right",
      }}>
      <CircularProgress size={50} thickness={4} />
    </div>
  );
}