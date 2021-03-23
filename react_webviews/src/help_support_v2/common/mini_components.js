import React, { Fragment } from "react";
import { SkeltonRect } from "common/ui/Skelton";
import Search from "../components/search";

export const MyQueries = (props) => {
  return (
    <div className={`${props.search ? "search-bar-header" : ""}`}>
      <div className="help-header-title">
        <div style={{ width: "75%" }}>{props.title}</div>
        <div onClick={() => props.onClick()} className="header-query">
          My queries
        </div>
      </div>
      {props.search && (
        <div className="help-search-bar">
          <Search value={props.value} onChange={(e) => props.onChange(e)} />
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
