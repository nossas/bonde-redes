// interface IfProps {
//   condition: any,
//   children?: React.ReactNode
// }

// interface IfElseProps {
//   condition: any,
//   True?: React.ReactNode,
//   False?: React.ReactNode,
// }

export const If = ({ condition, children }) => (condition ? children : false);

export const IfElse = ({ condition, True, False }) =>
  condition ? True : False;
