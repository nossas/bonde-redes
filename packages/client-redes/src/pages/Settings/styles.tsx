import styled from 'styled-components'

export const WrapForm = styled.div`
  padding: 30px;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.04) 2px 1px 14px 11px;
`

export const SettingsWrapper = styled.div`
  margin: 40px 0;
  width: 60%;
  display: flex;
  flex-direction: column;
  align-self: center;
  & > h3 {
    margin-bottom: 20px;
  }
`

export const BottomWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`