import React from "react";
import { Route, Switch } from "react-router-dom";
import "../common/theme/Style.scss";

import './Style.scss';
import NotFound from "../common/components/NotFound";
import CategoryList from './components/categoryList';
import Queries from './components/queries';
import Category from "./components/category";
import Questions from "./components/questions";
import Answers from "./components/answers";
import TicketConversations from "./components/conversations";
import SendQuery from "./components/send_query";

const HelpSupport = (props) => {
  const { url } = props.match;

  return (
    <Switch>
      <Route exact path={`${url}`} component={CategoryList} />
      <Route path={`${url}/queries`} component={Queries} />
      <Route path={`${url}/category`} component={Category} />
      <Route path={`${url}/questions`} component={Questions} />
      <Route path={`${url}/answers`} component={Answers} />
      <Route path={`${url}/conversation`} component={TicketConversations} />
      <Route path={`${url}/send-query`} component={SendQuery} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default HelpSupport;
