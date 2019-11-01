import React, {
  useState, useCallback,
} from 'react'
import { useSpring, animated } from 'react-spring'
import styled from 'styled-components';
import PropTypes from 'prop-types'

interface Props {
  open: boolean
  direction: 'top' | 'left'
  relative?: boolean
  className?: string
  size?: number
  children?: React.ReactNode
}

interface Animation {
  marginTop?: number
  marginLeft?: number
}

interface StyledDivProps {
  relative?: boolean
}

interface Size {
  node?: any
  width: number
  height: number
}

const StyledDiv = styled.div.attrs((p: StyledDivProps) => p)`
  position: ${(p) => (p.relative ? 'relative' : 'initial')};
`;

const AnimatedDiv = animated(StyledDiv)

const Panel: React.FC<Props> = ({
  direction,
  open,
  children,
  relative,
  className,
  size,
}) => {
  const [clientSize, setClientSize] = useState<Size>({
    height: 0,
    width: 0,
  })

  const measure = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setClientSize({
        node,
        width: node.clientWidth,
        height: node.clientHeight,
      })
    }
  }, [])

  let flag: number
  let animation: Animation
  if (direction === 'top') {
    flag = open ? 0 : ((size && -size) || -clientSize.height)
    animation = {
      marginTop: flag,
    }
  } else {
    flag = open ? 0 : ((size && -size) || -clientSize.width)
    animation = {
      marginLeft: flag,
    }
  }

  const props = useSpring(animation)

  return (
    <AnimatedDiv style={props} className={className} relative>
      <div ref={measure}>
        {children}
      </div>
    </AnimatedDiv>
  )
}

Panel.defaultProps = {
  relative: false,
  className: '',
  size: 0,
  children: null,
}


Panel.propTypes = {
  open: PropTypes.bool.isRequired,
  direction: PropTypes.any,
  relative: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.number,
  children: PropTypes.node,
}

export default Panel
