import React from "react";
import { Route } from "react-router";
import styled from "styled-components";
import { Header, Page, Flexbox2 as Flexbox, Footer } from "bonde-styleguide";
import { SessionHOC } from "../SessionProvider";
import UserDropdown from "./UserDropdown";
import CommunitiesDropdown from "./CommunitiesDropdown";

export interface Community {
  id: number;
  name: string;
  image: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

const SessionHeader = SessionHOC(
  (props: {
    children;
    session: {
      community: Community;
      user: User;
      logout: () => void;
      communities: Community[];
      onChangeCommunity: () => void;
    };
  }): React.ReactChild => {
    const {
      session: { user, logout, communities, community, onChangeCommunity }
    } = props;

    return (
      <Header>
        <Flexbox horizontal spacing="between">
          <CommunitiesDropdown
            communities={communities}
            community={community}
            onChange={onChangeCommunity}
          />
          <UserDropdown user={user} logout={logout} />
        </Flexbox>
      </Header>
    );
  }
);

const Main = styled.main`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
`;
const StyledFooter = styled(Footer)`
  position: relative;
`;

const SessionPage = ({
  children,
  ...props
}: {
  children: React.ReactChildren;
}): JSX.Element => (
  <Main>
    <SessionHeader />
    <Page {...props}>{children}</Page>
    <StyledFooter fixed />
  </Main>
);

interface PageLayoutProps {
  path: string;
  componentProps?: object;
  pageProps?: Record<string, string | number | undefined>;
  children: (any) => React.ReactChildren;
}

const PageLayout = (props: PageLayoutProps): React.ReactNode => {
  const { children, pageProps, componentProps, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(matchProps): React.ReactNode => {
        return (
          <SessionPage {...(pageProps || {})}>
            {children({ ...matchProps, ...(componentProps || {}) })}
          </SessionPage>
        );
      }}
    />
  );
};

export default PageLayout;
