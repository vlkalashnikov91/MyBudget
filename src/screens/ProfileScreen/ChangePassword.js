import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Form } from 'native-base'
import { UserAuth } from '../../actions/UserActions'

import { styles as main, ivanColor } from '../../Style'
import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'

class ChangePassword extends Component {
  constructor(props) {
    super(props)

    this.state = {
      oldPass: '',
      newPass: '',
      newRePass: '',
      oldPassErr: false,
      newPassErr: false,
      newRePassErr: false,
      changing: false
    }

    this._changePass = this._changePass.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { isLoad, Error } = nextProps.user
    if (this.state.changing) {
      if ((isLoad === false) && (Error.length === 0)) {
        ToastTr.Success('Пароль изменен')
        this.props.navigation.goBack()
      }
    }
  }

  _oldPass = value => {
    this.setState({ oldPass: value })
  }

  _newPass = value => {
    this.setState({ newPass: value })
  }

  _newRePass = value => {
    this.setState({ newRePass: value })
  }

  
  _checkParams() {
    st = this.state

    this.setState({ oldPassErr: false, newPassErr: false, newRePassErr: false })

    if (st.oldPass.length === 0) {
      this.setState({ oldPassErr: true })
      return false
    }

    if (st.newPass.length === 0) {
      this.setState({ newPassErr: true })
      return false
    }

    if (st.newRePass.length === 0) {
      this.setState({ newRePassErr: true })
      return false
    }

    if (st.newPass !== st.newRePass) {
      this.setState({ newPassErr: true, newRePassErr: true })
      return false
    }

    return true
  }

  _changePass() {
    if (this._checkParams()) {
      this.setState({ changing: true })
      this.props.changePassword(this.props.user.UserId, this.state.oldPass, this.state.newPass)
    }
  }

  render() {
    const { user } = this.props
    const {oldPass, newPass, newRePass, oldPassErr, newPassErr, newRePassErr} = this.state

    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem>
              <Body>
                <Form style={{alignSelf: 'stretch'}}>
                  <Item floatingLabel style={main.mt_0} error={oldPassErr}>
                    <Label style={main.fontFam}>Текущий пароль</Label>
                    <Input secureTextEntry={true} style={[main.clGrey, main.mt_5]} value={oldPass} onChangeText={this._oldPass}/>
                  </Item>

                  <Item floatingLabel error={newPassErr}>
                    <Label style={main.fontFam}>Новый пароль</Label>
                    <Input secureTextEntry={true} style={[main.clGrey, main.mt_5]} value={newPass} onChangeText={this._newPass}/>
                  </Item>

                  <Item floatingLabel error={newRePassErr}>
                    <Label style={main.fontFam}>Подтверждение пароля</Label>
                    <Input secureTextEntry={true} style={[main.clGrey, main.mt_5]} value={newRePass} onChangeText={this._newRePass}/>
                  </Item>
                </Form>
              </Body>
            </CardItem>
          </Card>

          <Card transparent>
            <CardItem>
              <Body>
                <Button block onPress={this._changePass} style={main.bgGreen}>
                {(user.isLoad)
                  ? <Text style={main.fontFam}>Загрузка...</Text>
                  : <Text style={main.fontFam}>Сохранить</Text>
                }
                </Button>
              </Body>
            </CardItem>
          </Card>
        </Content>

        <ModalLoading isActive={user.isLoad} color={ivanColor} />

      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.User
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changePassword: (UserId, oldPass, newPass) => {
        dispatch(UserAuth.ChangePass(UserId, oldPass, newPass))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)

