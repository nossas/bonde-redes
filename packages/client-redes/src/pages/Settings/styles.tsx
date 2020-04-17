import styled from "styled-components";

export const WrapForm = styled.div`
  padding: 30px;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.04) 2px 1px 14px 11px;
`;

export const SettingsWrapper = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  align-self: center;
  & > h3 {
    margin-bottom: 20px;
  }
  width: auto;
`;

export const Wrap = styled.div`
  display: grid;
  justify-items: center;
  width: 100%;
`;

export const BottomWrap = styled.div`
  display: grid;
  align-items: start;
  grid-template-columns: auto;
  grid-template-rows: auto auto;
  direction: rtl;
  grid-row-gap: 20px;
  & > div {
    grid-row-start: 1;
  }
  @media (min-width: 576px) {
    justify-content: space-between;
    grid-template-rows: auto;
    grid-template-columns: auto auto;
    grid-column-gap: 20px;
    direction: initial;
    & > div {
      grid-column-start: 2;
    }
  }
`;

export const WrapTextarea = styled.div`
  @media (min-width: 576px) {
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 20px;
  }
`;
