import React from "react";
import { Image, IconColorful } from "bonde-styleguide";

const defaultImageStyle = (
  props: DefaultImageStyleProps
): React.CSSProperties => ({
  backgroundColor: "#424242",
  borderRadius: "40px",
  padding: "6px 7px 5px 8px",
  textAlign: "center",
  ...props
});

const DefaultImage = (
  props: DefaultImageStyleProps = { width: "25px", height: "25px" }
): JSX.Element => (
  <div style={defaultImageStyle(props)}>
    <IconColorful name="community" size={25} />
  </div>
);

type DefaultImageStyleProps = {
  width: string;
  height: string;
};

interface ImageColProps {
  value: string;
  size: number;
  padding?: string;
}

const ImageCol = ({ value, size, ...rest }: ImageColProps): JSX.Element => {
  return value ? (
    <Image src={value} width={size} height={size} rounded={size} {...rest} />
  ) : (
    <DefaultImage width={`${size}px`} height={`${size}px`} {...rest} />
  );
};

export default ImageCol;
