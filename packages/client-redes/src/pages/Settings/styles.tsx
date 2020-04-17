import styled from "styled-components";

export const WrapForm = styled.div`
  padding: 30px;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.04) 2px 1px 14px 11px;
`;

export const SettingsWrapper = styled.div`
  width: 100%;
`;

export const HeaderWrap = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: auto;
  grid-template-rows: auto auto;
  grid-row-gap: 20px;
  @media (min-width: 370px) {
    justify-content: space-between;
    grid-template-rows: auto;
    grid-template-columns: auto 190px;
  }
  & > button {
    padding: 12px 20px;
  }
  margin-bottom: 30px;
`;

export const WrapTextarea = styled.div`
  @media (min-width: 576px) {
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 20px;
  }
`;
