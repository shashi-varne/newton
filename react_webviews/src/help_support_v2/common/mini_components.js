import React, { Fragment } from "react";
import { SkeltonRect } from "common/ui/Skelton";
import Search from "../components/search";
import back_arrow from 'assets/back_arrow.svg';
import { IconButton } from "@material-ui/core";
import SVG from 'react-inlinesvg';

export const MyQueries = (props) => {
  return (
    <div className={`${props.search ? props.showButton ? "search-bar-header search-bar-header-w-button" : "search-bar-header" : ""}`}>
      <div className={props.showButton ? "help-header-title help-header-title-w-button" : "help-header-title"}>
        <div style={{ width: "75%",display:"flex",alignItems:"center" }}>
          <IconButton
            color="inherit" aria-label="Menu"
          // onClick={}
          className={props.showButton?"showButton":"hideButton"}>
            <SVG
              preProcessor={code => code.replace(/fill=".*?"/g, 'fill=black')}
              src={back_arrow}
            />
          </IconButton>
        {props.title}</div>
        <div onClick={() => props.onClick()} className="header-query">
          My queries
        </div>
      </div>
      {props.search && (
        <div className={props.showButton?"help-search-bar help-search-bar-w-button":"help-search-bar"}>
          <Search
            value={props.value}
            onChange={(e) => props.onChange(e)}
            onSearch={(e) => props.onSearch(e)}
            componentClicked={props.componentClicked}
            maxLength={50}
          />
        </div>
      )}
    </div>
  );
};

export const TicketStatus = (props) => {
  return (
    <div className="help-header-title">
      <div>{props.title}</div>
      {props.headerStatus && (
        <div className="header-status">
          Status:{" "}
          <span
            style={{
              color: `${props.headerStatus === "Closed" ? "red" : "green"}`,
            }}
          >
            {props.headerStatus}
          </span>
        </div>
      )}
    </div>
  );
};

export const CustomSkelton = (props) => {
  return (
    <Fragment>
      {[...Array(props.length || 4)].map((item, index) => (
        <div className="skelton" key={index}>
          <SkeltonRect className="balance-skelton" />
          <SkeltonRect className="balance-skelton balance-skelton2" />
        </div>
      ))}
    </Fragment>
  );
};
