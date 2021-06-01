import React from 'react'
import StarIcon from "@material-ui/icons/Star";

function PassiveStarRating({value}) {
    return (
        <span style={{marginTop: '2px'}}>
           {[...Array(5)].map(
              (el, idx) => {
                if (idx < value) {
                  return (
                    <StarIcon
                      key={idx}
                      style={{
                        color: "#FFD951",
                        fontSize: "14px",
                        height: "14px",
                      }}
                    />
                  );
                } else {
                  return (
                    <StarIcon
                      key={idx}
                      style={{
                        color: "#FFD951",
                        opacity: "0.4",
                        fontSize: "14px",
                        height: "14px",
                      }}
                    />
                  );
                }
              }
            )} 
        </span>
    )
}

export default PassiveStarRating
