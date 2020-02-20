import React, { useMemo, useState } from 'react'
import { Route } from 'react-router'
import styled from 'styled-components'
import { Header, Navbar, Page, Flexbox2 as Flexbox, Footer, IconColorful } from 'bonde-styleguide'
import { SessionHOC } from '../SessionProvider'
import UserDropdown from './UserDropdown'
import CommunitiesDropdown from './CommunitiesDropdown'


const SessionHeader = SessionHOC((props: any) => {
  // dummy communities
  const communities = useMemo(() => [
    { id: 8, name: 'Meu Rio', city: 'Rio de Janeiro' },
    { id: 9, name: 'Minha Sampa', city: 'São Paulo' },
    { id: 10, name: 'Mapa do acolhimento', city: 'São Paulo' }
  ], [])

  const { session: { user, logout, community, onChangeCommunity } } = props

  return (
    <Header>
      <Flexbox horizontal spacing='between'>
        <CommunitiesDropdown
          communities={communities}
          communityId={community.id}
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

const SessionPage = ({ children, ...props }: any) => (
  <Main>
    <SessionHeader />
    <Page {...props}>
      {children}
    </Page>
    <Footer fixed />
  </Main>
)

interface PageLayoutProps {
  component: any;
  componentProps: object;
  pageProps: object;
}

const PageLayout = (props: PageLayoutProps) => {
  console.log('PageLayout')
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
