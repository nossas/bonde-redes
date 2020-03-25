import { useState, useCallback, useEffect } from "react";
// import { FullPageLoading } from 'bonde-styleguide'

const useFilteredCommunity = (
  defaultCommunity: string,
  onChange: (c: string) => Promise<void>
): [string, Function] => {
  const [community, setCommunity] = useState("");

  useEffect(() => {
    setCommunity(defaultCommunity);
  }, [defaultCommunity, setCommunity]);

  const handleCommunityChange = useCallback(
    c => {
      return onChange(c).then(() => setCommunity(c));
    },
    [setCommunity]
  );

  return [community, handleCommunityChange];
};

export default useFilteredCommunity;
