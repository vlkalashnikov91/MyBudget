import React, {Component} from 'react'
import { Modal } from 'react-native'
import { View, Spinner } from 'native-base'
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
    return (
      <Modal animationType="fade"
        transparent={true}
        visible={this.props.isActive}
        onRequestClose={this._hideModalLoad}
      >
        <View style={main.modalOverlay} />
          <View style={[main.jC_C, main.aI_C, main.fl_1]} >
            <View style={{backgroundColor:'rgba(0, 0, 0, 0.6)', borderRadius:8, paddingLeft:20, paddingRight:20}}>
              <Spinner/>
            </View>
        </View>
      </Modal>
    )
  }
}
