import styled from 'styled-components';
import { Button } from 'bonde-styleguide'

export const FullWidth = styled.div`
  width: 100%;
  padding: 40px;
`
export const Spacing = styled.div`
  margin-bottom: ${props => props.margin}px
`

export const BtnWarning = styled(Button)`
  border-color: #EE0090;
  color: #EE0090
`