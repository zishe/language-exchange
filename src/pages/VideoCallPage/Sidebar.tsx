import * as React from 'react'
import styled from '../../constants/themed-components'
import { CallButton } from '../../containers/CallButton'

const Sidebar = ({ ...rest }) => (
  <div {...rest}>
    <CallButton />
  </div>
)

const StyledSidebar = styled(Sidebar)`
  color: ${({ theme }) => theme.colors.white}
  background-color: ${({ theme }) => theme.colors.black}
  padding: 10px
  width: 120px
  display: flex
  align-items: center
  justify-content: center
`

export { StyledSidebar as Sidebar }