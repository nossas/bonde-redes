import React from 'react'
import styled from 'styled-components'
import { Footer } from 'bonde-styleguide'
import Header from './Header'
import Content from './Content'

const FlexDiv = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`

const ScrollView = styled.div`
  overflow-y: auto;
  flex-grow: 1;
`

const FixedDiv = styled.div`
  flex-shrink: 0;
`

const Page = () => (
  <FlexDiv>
    <Header>
      <ScrollView>
        <Content />
      </ScrollView>
      <FixedDiv>
        <Footer />
      </FixedDiv>
    </Header>
  </FlexDiv>
)

export default Page
