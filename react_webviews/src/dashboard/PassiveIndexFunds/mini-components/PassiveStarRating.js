import React from 'react'
import StarIcon from "@material-ui/icons/Star";

function PassiveStarRating({value}) {
    return (
        <div>
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
        </div>
    )
}

export default PassiveStarRating
