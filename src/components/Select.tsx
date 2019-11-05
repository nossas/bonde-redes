import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Wrapper = styled.div`
  width: 100%;
  padding-bottom: 17px;
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

interface Props {
  label: string
  onChange?: (e: any) => void
  value: any
  children?: React.ReactNode
}

const Select: React.FC<Props> = ({
  label, children, onChange, value,
}) => (
  <Wrapper>
    <DivText>
      {label.toUpperCase()}
    </DivText>
    <br />
    <WrapperSelect>
      <StyledSelect value={value} onChange={onChange}>
        {children}
      </StyledSelect>
    </WrapperSelect>
  </Wrapper>
)

Select.defaultProps = {
  children: null,
  onChange: () => {},
}

Select.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  onChange: PropTypes.func,
  value: PropTypes.oneOf(['lawyer', 'therapist', 'default', 'individual']).isRequired,
}

export default Select
