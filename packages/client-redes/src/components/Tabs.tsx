import React from "react";
import { Tab, TabItem } from "bonde-styleguide";
import { NavLink } from "react-router-dom";

type Tabs = {
  tabs: Array<{ name: string; to: string }>;
  selectedTab: string;
};

const Tabs = ({ tabs, selectedTab }: Tabs) => {
  return (
    <Tab>
      {tabs.map(({ name, to }, i) => (
        <NavLink to={to} key={`page-tabs-${i}`}>
          <TabItem active={selectedTab === name}>{name}</TabItem>
        </NavLink>
      ))}
    </Tab>
  );
};

export default Tabs;
