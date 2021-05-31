import Button from '@material-ui/core/Button'
import React from 'react'
import "./commonStyles.scss"

const FilterButton = (props) => {
  return (
    <Button variant="outlined" color="primary" {...props}>
      <div className="icon">
        <svg
          version="1.1"
          viewBox="0 0 19 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>filter_by_icon</title>
          <desc>Created with Sketch.</desc>
          <g fillRule="evenodd">
            <g
              transform="translate(-112 -1042)"
              fillRule="nonzero"
            >
              <path d="m115 1052h2v5h-2v3h-1v-3h-2v-5h2v-10h1v10zm7-7h2v5h-2v10h-1v-10h-2v-5h2v-3h1v3zm7 6h2v5h-2v4h-1v-4h-2v-5h2v-9h1v9zm-2 1v3h3v-3h-3zm-7-6v3h3v-3h-3zm-7 7v3h3v-3h-3z" />
            </g>
          </g>
        </svg>
      </div>
      <div className="title">Filter</div>
    </Button>
  )
}

export default FilterButton
