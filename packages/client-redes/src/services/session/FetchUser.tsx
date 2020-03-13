import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { FullPageLoading } from "bonde-styleguide";
import { redirectToLogin } from "../utils";

const FETCH_USER = gql`
  query CurrentUser {
    currentUser {
      id
      firstName
      lastName
      email
      createdAt
    }
  }
`;

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  id: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default ({ children }): any => {
  const { loading, error, data } = useQuery<{ currentUser: User }>(FETCH_USER);

  if (loading) return <FullPageLoading message="Carregando usuário..." />;

  if (error || (data && !data.currentUser)) {
    console.log("error", { error, data });
    redirectToLogin();
  }

  return children({ user: data && data.currentUser });
};
