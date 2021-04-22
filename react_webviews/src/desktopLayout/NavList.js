import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import RateReviewIcon from "@material-ui/icons/RateReview";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import BarChartIcon from "@material-ui/icons/MultilineChart";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CreateIcon from "@material-ui/icons/Create";
import ReceiptIcon from "@material-ui/icons/Receipt";
import ListItemText from "@material-ui/core/ListItemText";
import { Link, NavLink } from "react-router-dom";
const data = [
  {
    id: 0,
    name: "Register",
    icon: <RateReviewIcon />,
    path: "/register",
  },
  {
    id: 1,
    name: "Notification",
    icon: <NotificationsActiveIcon />,
    path: "/notification",
  },
  {
    id: 2,
    name: "Invest",
    icon: <AttachMoneyIcon />,
    path: "/invest",
  },
  {
    id: 3,
    name: "Reports",
    icon: <BarChartIcon />,
    path: "/reports",
  },
  {
    id: 4,
    name: "Withdraw",
    icon: <ReceiptIcon />,
    path: "/withdraw",
  },
  {
    id: 5,
    name: "Financial Health Check",
    icon: <LocalHospitalIcon />,
    path: "/reports",
  },
  {
    id: 6,
    name: "Refer & Earn",
    icon: <AddBoxIcon />,
  },
  {
    id: 7,
    name: "Write to us",
    icon: <CreateIcon />,
    path: "/reports",
  },
];
const NavList = ({ handleClick }) => {
  const handleModal = () => {
    alert("open modal");
  };
  return (
    <List>
      {data.map((el) => {
        return (
          <ListItem
            button
            key={el.id}
            component={el.path ? NavLink : null}
            to={el.path ? el.path : null}
            onClick={el.name === "Refer & Earn" ? handleModal : handleClick}
          >
            <ListItemIcon>{el.icon}</ListItemIcon>
            <ListItemText primary={el.name} />
          </ListItem>
        );
      })}
    </List>
  );
};
export default NavList;