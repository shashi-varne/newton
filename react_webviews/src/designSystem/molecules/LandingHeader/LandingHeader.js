/*
  Prop description:
  LandingHeader:
    variant: one of type => 'center', 'side'
    children: this will only accept 'LandingHeaderTitle', 'LandingHeaderSubtitle', 'LandingHeaderPoints', 'LandingHeaderImage'.
    dataAid: unique id.

  LandingHeaderTitle:
    color: color which will be used for the child.
    children: text for the title.
    
  LandingHeaderSubtitle:
    children: It will only accept Typography component, which can be a single <Typography/> component,
              or a list of Typography component.
              - dataAid for single Typography will be tv_subtitle.
              - dataAid for list Typography will be tv_subtitle{idx}.
    color: This color will be passed to all the Typography component, you can also override this color by
           passing color to individual Typography item.

  LandingHeaderPoints:
    This component will convert the Typography child components into list with bullet points.
    children: It will only accept Typography component, which can be a single <Typography/> component,
              or a list of Typography component.
              - dataAid for single Typography will be tv_subtitle.
              - dataAid for list Typography will be tv_subtitle{idx}.
    color: This color will be passed to all the Typography component, you can also override this color by
           passing color to individual Typography item.
  
  Usage of the component:
   <LandingHeader>
      <LandingHeaderImage imgSrc={require('assets/amazon_pay.svg')} />
      <LandingHeaderTitle>I am title</LandingHeaderTitle>
      <LandingHeaderSubtitle dataIdx={1}>
        <Typography variant='inherit' color='inherit' component='span' className='custom-text-elipsis'>
          These funds essentially invest in stocks of various two line text, limit - 99
          characters or 17 words
        </Typography>
      </LandingHeaderSubtitle>
      <LandingHeaderPoints dataIdx={1}>
        One line text, limit - 46 characters or 9 words
      </LandingHeaderPoints>
      <LandingHeaderSubtitle dataIdx={2}>
        These funds essentially invest in stocks of various two line text, limit - 99 characters
        or 17 words
      </LandingHeaderSubtitle>
      <LandingHeaderPoints dataIdx={2}>
        One line text, limit - 46 characters or 9 words
      </LandingHeaderPoints>
    </LandingHeader>

  NOTE: STRONGLY RECOMMENDED TO ONLY USE FOUNDATION COLORS.
  Example to pass color:
    color: 'foundationColors.secondary.mango.300'
*/

import React, { useState } from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import Typography from "../../atoms/Typography";
import isArray from "lodash/isArray";

import "./LandingHeader.scss";
import Icon from "../../atoms/Icon";
import { useDispatch } from "react-redux";
import { setDiySeeMore } from "businesslogic/dataStore/reducers/diy";

export const LandingHeader = ({ variant, children, dataAid }) => {
  const variantClass =
    variant === "center" ? "landing-header-center-align" : "";
  return (
    <Box
      className={`landing-header-wrapper ${variantClass}`}
      data-aid={`landingHeader_${dataAid}`}
    >
      {children}
    </Box>
  );
};

export const LandingHeaderImage = ({ imgSrc, imgProps = {} }) => {
  return (
    <Icon
      src={imgSrc}
      width="140px"
      height="120px"
      {...imgProps}
      dataAid="top"
    />
  );
};

export const LandingHeaderTitle = ({ children, color, align = "left" }) => {
  return (
    <Typography
      variant="heading1"
      align={align}
      color={color}
      dataAid="title"
      component="div"
    >
      {children}
    </Typography>
  );
};

export const LandingHeaderSubtitle = ({
  children,
  color,
  dataIdx = "",
  align = "left",
}) => {
  return (
    <Typography
      className="lh-subtitle"
      dataAid={`subtitle${dataIdx}`}
      variant="body2"
      color={color}
      align={align}
      component="div"
    >
      {children}
    </Typography>
  );
};

export const LandingHeaderPoints = ({
  children,
  color,
  dataIdx,
  align = "left",
}) => {
  return (
    <ul className="lh-description-list">
      <li className="lh-description-item">
        <Typography
          variant="body2"
          color={color}
          align={align}
          dataAid={`point${dataIdx}`}
          component="div"
        >
          {children}
        </Typography>
      </li>
    </ul>
  );
};

export const LandingHeaderSeeMoreWrapper = ({
  subtitle = "",
  points = [],
  subtitleDataIdx,
}) => {
  const [seeMore, setSeeMore] = useState(false);
  const dispatch = useDispatch();

  const handleSeeMore = () => {
    dispatch(setDiySeeMore(true));
    setSeeMore((prevState) => !prevState);
  };
  return (
    <>
      {seeMore ? (
        <div onClick={handleSeeMore}>
          {subtitle && (
            <LandingHeaderSubtitle dataIdx={subtitleDataIdx}>
              {subtitle}
            </LandingHeaderSubtitle>
          )}
          {isArray(points) &&
            points?.map((point, idx) => {
              return (
                <LandingHeaderPoints key={idx} dataIdx={idx + 1}>
                  {point}
                </LandingHeaderPoints>
              );
            })}
          <Typography variant="body8" color="secondary">
            See less
          </Typography>
        </div>
      ) : (
        <div onClick={handleSeeMore}>
          {subtitle && (
            <LandingHeaderSubtitle dataIdx={subtitleDataIdx}>
              {subtitle.slice(0, 89).trim()}...
              <Typography variant="body8" color="secondary">
                See more
              </Typography>
            </LandingHeaderSubtitle>
          )}
        </div>
      )}
    </>
  );
};

LandingHeader.defaultProps = {
  variant: "side",
};

LandingHeader.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["side", "center"]),
  dataAid: PropTypes.string,
};

LandingHeaderTitle.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};

LandingHeaderSubtitle.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  dataIdx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

LandingHeaderSubtitle.defaultProps = {
  color: "foundationColors.content.secondary",
};
LandingHeaderPoints.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  dataIdx: PropTypes.number.isRequired,
};

LandingHeaderPoints.defaultProps = {
  color: "foundationColors.content.secondary",
};
