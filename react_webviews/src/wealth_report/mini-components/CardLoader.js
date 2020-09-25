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
        height: "100%",
        clear: "right",
      }}>
      <CircularProgress size={50} thickness={4} />
    </div>
  );
}