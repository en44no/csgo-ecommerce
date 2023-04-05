import { Tooltip, useMediaQuery } from '@chakra-ui/react';
import React from 'react'

const TooltipP = (props) => {
  const [isMobile] = useMediaQuery('(max-width: 479px)');

  const {
    children,
    backgroundColor = '#2d3748',
    textColor = '#ffffff',
    placement = 'top',
    label
  } = props;

  return (
    <>
      {!isMobile ? (
        <Tooltip bg={backgroundColor} color={textColor} borderRadius='9px' placement={placement} label={label} aria-label={label}>
          {children}
        </Tooltip>
      ) : (
        <>
          {children}
        </>
      )}
    </>
  )
}

export default TooltipP