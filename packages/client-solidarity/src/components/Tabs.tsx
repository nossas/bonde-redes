import React from "react";
import { Tab } from "bonde-components";
import { NavLink } from "react-router-dom";
// import styled from "styled-components";

type Tabs = {
  tabs: Array<{ name: string; to: string }>;
  selectedTab: string;
};

// type ItemProps = {
//   inverted?: boolean;
//   active?: boolean;
// };

// const TabItem = styled.span<ItemProps>`
//   display: inline-block;
//   font-family: "Nunito Sans", sans-serif;
//   font-size: 13px;
//   font-weight: 800;
//   line-height: 1.15;
//   color: ${props => (props.inverted ? "#000" : "#fff")};
//   text-transform: uppercase;
//   cursor: pointer;
//   margin: 0 15px 0 0;
//   padding-bottom: 11px;
//   text-decoration: none;

//   ${props =>
//     props && props.active
//       ? `
//     border-bottom: 2px solid #ee0099;
//     padding-bottom: 9px;
//   `
//       : undefined}

//   &:hover, &:active {
//     border-bottom: 2px solid #ee0099;
//     padding-bottom: 9px;
//   }
// `;

const Tabs = ({ tabs, selectedTab }: Tabs) => {
  return (
    <>
      {tabs.map(({ name, to }, i) => (
        <NavLink to={to} key={`page-tabs-${i}`}>
          <Tab active={selectedTab === name}>{name}</Tab>
        </NavLink>
      ))}
    </>
  );
};

export default Tabs;
