import { useState, useCallback, useEffect } from 'react'
// import { FullPageLoading } from 'bonde-styleguide'

const useFilteredCommunity = (defaultCommunity, onChange): any => {
  const [community, setCommunity] = useState(undefined)

  useEffect(() => {
    setCommunity(defaultCommunity)
  }, [defaultCommunity, setCommunity])

  const handleCommunityChange = useCallback(
    c => {
      return onChange(c).then(() => setCommunity(c))
    },
    [setCommunity]
  )

  return [community, handleCommunityChange]
}

export default useFilteredCommunity