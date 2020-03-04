import React from 'react'
import { Route } from 'react-router'
import styled from 'styled-components'
import { Header, Page, Flexbox2 as Flexbox, Footer } from 'bonde-styleguide'
import { SessionHOC } from '../SessionProvider'
import UserDropdown from './UserDropdown'
import CommunitiesDropdown from './CommunitiesDropdown'


const SessionHeader = SessionHOC((props: any) => {
  const { session: { user, logout, communities, community, onChangeCommunity } } = props

  return (
    <Header>
      <Flexbox horizontal spacing='between'>
        <CommunitiesDropdown
          communities={communities}
          community={community}
          onChange={onChangeCommunity}
        />
        <UserDropdown user={user} logout={logout} />
      </Flexbox>
    </Header>
  )
})


const Main = styled.main`
  display: flex;
  flex-flow: column  nowrap;
  height: 100%;
`
const StyledFooter = styled(Footer)`
  position: relative;
`

const SessionPage = ({ children, ...props }: any) => (
  <Main>
    <SessionHeader />
    <Page {...props}>
      {children}
    </Page>
    <StyledFooter fixed />
  </Main>
)

interface PageLayoutProps {
  component: any;
  componentProps: object;
  pageProps: object;
}

const PageLayout = (props: PageLayoutProps) => {
  const { component: Component, pageProps, componentProps, ...rest } = props

  return (
    <Route {...rest} render={(matchProps) => {
      return (
        <SessionPage {...(pageProps || {})}>
          <Component {...matchProps} {...(componentProps || {})} />
        </SessionPage>
      )
    }} />
  )
}

export default PageLayout
