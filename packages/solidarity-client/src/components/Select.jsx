import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Wrapper = styled.div`
  width: 200px;
`

const DivText = styled.label`
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 600;
  font-size: 13px;
  line-height: 1.15;
  letter-spacing: 0.5px;
  color: #aaa;
  text-transform: uppercase;
`

const WrapperSelect = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid;
  border-color: #AAAAAA;

  &:hover {
    border-color: #e2058a;
  }
`

const StyledSelect = styled.select`
  width: 100%;
`;

// interface Props {
//   label: string
//   onChange?: (e: any) => void
//   value: any
//   dicio?: any
// }

const renderOptions = (dicio) => 
  Object.keys(dicio).map((i) => 
    <option key={i} value={i}>{dicio[i]}</option>
  )

const Select = ({
  label, dicio, onChange, value,
}) => 
  <Wrapper>
    <DivText>
      {label.toUpperCase()}
    </DivText>
    <br />
    <WrapperSelect>
      <StyledSelect value={value} onChange={onChange}>
        {renderOptions(dicio)}
      </StyledSelect>
    </WrapperSelect>
  </Wrapper>

Select.defaultProps = {
  children: null,
  onChange: () => {},
}

Select.propTypes = {
  label: PropTypes.string.isRequired,
  dicio: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string.isRequired,
}

export default Select
