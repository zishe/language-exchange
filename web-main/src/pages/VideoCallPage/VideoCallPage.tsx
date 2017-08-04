import * as React from 'react'
import { connect } from 'react-redux'
import * as Router from 'react-router'
import * as Notifications from 'react-notification-system-redux'
import * as CopyToClipboard from 'react-copy-to-clipboard'
import { actions, peerId, isCallAnswered, isCalling, isReady } from '../../modules/peerjs'
import { State as ReduxState } from '../../modules'
import styled from '../../constants/themed-components'
import { HeaderWithContent } from '../../components/HeaderWithContent'
import { PeerConnection } from '../../containers/PeerConnection'
import { FullscreenVideo } from './FullscreenVideo'
import { PopupVideo } from './PopupVideo'
import { Sidebar } from './Sidebar'
import { Button } from '../../ui/Button'
import { push } from 'connected-react-router'
import { routeNames } from '../../constants/routeNames'

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-between;
  background-color: ${({ theme }) => theme.colors.black};
  height: 100%;
  width: 100%;
`

const NotificationActions = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

type OwnProps = Router.RouteComponentProps<{
  recipientId?: string
}>

type StateProps = {
  peerId?: string,
  isCallAnswered: boolean,
  isCalling: boolean,
  isReady: boolean
}

type DispatchProps = {
  startCall: typeof actions.startCall
  showInfoNotification: typeof Notifications.info
  push: typeof push
}

type Props = StateProps & OwnProps & DispatchProps
type State = {
  localStream?: MediaStream
  remoteStream?: MediaStream
}

class VideoCallPage extends React.Component<Props, State> {
  state: State = {
    localStream: undefined,
    remoteStream: undefined
  }

  componentDidMount() {
    this.loadCamera()
  }

  componentDidUpdate() {
    const recipientId = this.props.match.params.recipientId
    const readyToMakeACall = this.props.isReady
      && !this.props.isCallAnswered
      && !this.props.isCalling
      && this.state.localStream

    if (!this.state.localStream) {
      this.loadCamera()
    } else if (recipientId && readyToMakeACall) {
      this.props.startCall(recipientId)
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.peerId && nextProps.peerId) {
      const callURL = `${window.location.origin}${nextProps.match.url}/${nextProps.peerId}`
      nextProps.showInfoNotification({
        title: 'Your id:',
        message: nextProps.peerId,
        position: 'tr',
        autoDismiss: 0,
        dismissible: false,
        children: (
          <NotificationActions>
            <CopyToClipboard text={callURL}>
              <Button color="secondary">Copy Link</Button>
            </CopyToClipboard>
          </NotificationActions>
        )
      })
    }
  }

  loadCamera = () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => this.setState({ ...this.state, localStream: stream }))
  }

  handleStream = (remoteStream?: MediaStream) => {
    if (remoteStream) {
      this.setState({ ...this.state, remoteStream })
    }
  }

  handleCloseCall = () => {
    this.setState({ ...this.state, localStream: undefined, remoteStream: undefined })
    this.props.push(routeNames.call)
  }

  render() {
    const peerConnection = this.state.localStream
      ? (
        <PeerConnection
          localStream={this.state.localStream}
          onStream={this.handleStream}
          onClose={this.handleCloseCall}
        />
      )
      : null
    const minimizedLocalVideo = this.state.remoteStream
      ? <PopupVideo source={this.state.localStream} muted />
      : null
    
    return (
      <HeaderWithContent fullscreen>
        {peerConnection}
        <ContentContainer>
          <FullscreenVideo source={this.state.remoteStream || this.state.localStream}/>
          <Sidebar />
        </ContentContainer>
        {minimizedLocalVideo}
      </HeaderWithContent>
    )
  }
}

const StyledVideoCallPage = styled(VideoCallPage)`
  background-color: ${({ theme }) => theme.colors.white};
`

const mapStateToProps = (state: ReduxState) => ({
  peerId: peerId(state),
  isCallAnswered: isCallAnswered(state),
  isCalling: isCalling(state),
  isReady: isReady(state)
})

const mapDispatchToProps = {
  startCall: actions.startCall,
  showInfoNotification: Notifications.info,
  push: push
}

const ConnectedVideoCallPage = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(StyledVideoCallPage)

export { ConnectedVideoCallPage as VideoCallPage }