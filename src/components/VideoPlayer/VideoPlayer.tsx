import * as React from 'react'
import { isString } from '../../utils/stringUtils'

type SourceType = MediaStream | string | undefined

export type Props = React.HTMLAttributes<HTMLVideoElement> & {
  source: SourceType,
  onStartPlaying?: Function
}

export default class VideoPlayer extends React.Component<Props, {}> {
  videoPlayer: HTMLVideoElement
  eventListener: EventListener

  componentDidMount() {
    this.applyMediaSource(this.props.source)
    this.videoPlayer.addEventListener('playing', this.handlePlayingEvent)
  }

  componentWillUnmount() {
    this.videoPlayer.removeEventListener('playing', this.handlePlayingEvent)
    const stream = this.props.source
    if (stream instanceof MediaStream) {
      stream.getTracks().forEach(track => track.stop())
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.source !== nextProps.source) {
      this.applyMediaSource(nextProps.source)
    }
  }

  handlePlayingEvent = (e: Event) => {
    if (this.props.onStartPlaying) {
      this.props.onStartPlaying()
    }
  }

  applyMediaSource(source: SourceType) {
    if (source && !isString(source)) {
      this.videoPlayer.srcObject = source as MediaStream
    }
  }

  render() {
    const { source, onStartPlaying, ...rest } = this.props
    const renderVideo = ({ ...props }) => (
      <video ref={(player) => this.videoPlayer = player} autoPlay {...props} />
    )

    if (isString(this.props.source)) {
      return renderVideo({ src: source, ...rest })
    } else {
      return renderVideo(rest)
    }
  }
}