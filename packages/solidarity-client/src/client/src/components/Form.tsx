import React from "react";
// import PropTypes from 'prop-types'
import {
  Button,
  Flexbox2 as Flexbox,
  FormField,
  Input,
  Text
} from "bonde-styleguide";
import styled from "styled-components";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useForm, Controller } from "react-hook-form";

import MapsSearchInput from "./Search/MapsSearchInput";

// interface Props {
//   onSubmit: () => void
// }

const FormWrapper = styled.form`
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;
const StyledField = styled(FormField)`
  padding: 0;
  color: rgba(255, 255, 255, 1);
  position: relative;
  top: 16px;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const LabelsWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const StyledLabel = styled.label`
  font-size: 13px;
  font-weight: 400;
  font-style: normal;
  line-height: 1.15;
  color: rgba(170, 170, 170, 1);
  padding-right: 10px;
`;

interface GeobondeForm {
  geolocation: {
    lat: string | null;
    lng: string | null;
  };
  distance: number;
  therapist: boolean;
  lawyer: boolean;
  individual: boolean;
}

const Form: React.FC = () => {
  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    errors,
    control,
    setError,
    clearError
  } = useForm<GeobondeForm>({
    defaultValues: {
      distance: 20,
      therapist: true,
      lawyer: true,
      individual: true
    }
  });
  const setForm = useStoreActions((actions: any) => actions.geobonde.setForm);
  const tableData = useStoreState(state => state.table.data);
  React.useEffect(() => {
    register({ name: "geolocation" });
  }, [register]);

  const handleChange = (field: string, value: string | number) => {
    clearError(field);
    return setValue(field, value);
  };

  const onSubmit = (data: any, e: any) => {
    e.preventDefault();

    if (typeof data.geolocation === "undefined")
      return setError("geolocation", "required", "Esse campo é obrigatório");

    return setForm({
      ...data,
      lat: data.geolocation.lat,
      lng: data.geolocation.lng
    });
  };

  type LatLng = {
    lat: number;
    lng: number;
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <div>
        <MapsSearchInput
          name="address"
          label="Endereço"
          placeholder="Digite o endereço"
          onChangeLocation={(e: any) => handleChange("geolocation", e)}
          value={getValues().geolocation as LatLng}
        />
        <Text color="#ffffff">
          {errors.geolocation && (errors as any).geolocation["message"]}
        </Text>
      </div>
      <Controller
        as={
          <StyledField
            label="Distância (km)"
            placeholder="Informe o raio de busca"
            inputComponent={Input}
            input={null}
          />
        }
        name="distance"
        control={control}
      />
      <Column>
        <LabelsWrapper>
          <StyledLabel htmlFor="lawyer">
            <input type="checkbox" name="lawyer" ref={register} /> Advogada
          </StyledLabel>
          <br />
          <StyledLabel htmlFor="therapist">
            <input type="checkbox" name="therapist" ref={register} /> Terapeuta
          </StyledLabel>
          <br />
          <StyledLabel htmlFor="individual">
            <input type="checkbox" name="individual" ref={register} /> MSR
          </StyledLabel>
        </LabelsWrapper>
        <Flexbox middle>
          <Button type="submit" disabled={tableData.length < 1}>
            Buscar
          </Button>
        </Flexbox>
      </Column>
    </FormWrapper>
  );
};

export default Form;
