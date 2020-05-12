import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 200px;
`;

const DivText = styled.label`
  font-family: "Nunito Sans", sans-serif;
  font-weight: 600;
  font-size: 13px;
  line-height: 1.15;
  letter-spacing: 0.5px;
  color: #aaa;
  text-transform: uppercase;
`;

const WrapperSelect = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid;
  border-color: #aaaaaa;

  &:hover {
    border-color: #e2058a;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  color: rgba(255, 255, 255, 1);
`;

const Option = styled.option`
  color: #000000;
`;

// interface Props {
//   label: string
//   onChange?: (e: any) => void
//   value: any
//   dicio?: any
// }

const renderOptions = (dicio: Record<string, any>) =>
  Object.keys(dicio).map(i => (
    <Option key={i} value={i}>
      {dicio[i]}
    </Option>
  ));

type Props = {
  label: string;
  dicio: Record<string, any>;
  defaultValue: string;
  name: string;
  register: any;
};

const Select = ({ label, dicio, defaultValue, name, register }: Props) => (
  <Wrapper>
    <DivText>{label.toUpperCase()}</DivText>
    <br />
    <WrapperSelect>
      <StyledSelect name={name} ref={register}>
        <Option value="default">{defaultValue}</Option>
        {renderOptions(dicio)}
      </StyledSelect>
    </WrapperSelect>
  </Wrapper>
);

Select.defaultProps = {
  defaultValue: "default"
};

export default Select;
