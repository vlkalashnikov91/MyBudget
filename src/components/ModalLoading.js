import React, {Component} from 'react'
import { Modal } from 'react-native'
import { View } from 'native-base'
import { SkypeIndicator } from 'react-native-indicators'
import { styles as main } from '../Style'


export default class ModalLoading extends Component {
  constructor(props) {
    super(props)

    this.state = {
        visibleModalLoad: false
    }
  }

  _hideModalLoad() {
    this.setState({ visibleModalLoad: false })
  }

  render() {
    const { color } = this.props
    const mainColor = ((color===undefined)||(color===null)||(color.length===0))? 'white' : color

    return (
      <Modal animationType="fade"
        transparent={true}
        visible={this.props.isActive}
        onRequestClose={this._hideModalLoad}
      >
        <View style={main.modalOverlay} />
        <SkypeIndicator color={mainColor} animationDuration={1000} />
      </Modal>
    )
  }
}