import * as React from 'react'
import styled from '../../constants/themed-components'
import * as backgroundImage from './assets/background.jpg'

const MainSection = ({ ...rest }) => (
  <div {...rest} />
)

const StyledMainSection = styled(MainSection)`
  background-color: ${({ theme }) => theme.colors.secondary};
  background-image: url(${backgroundImage});
  background-size: contain;
  background-position: center bottom;
  background-repeat: no-repeat;
  min-height: 100vh;
`

export { StyledMainSection as MainSection }
