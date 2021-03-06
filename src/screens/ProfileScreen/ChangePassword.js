import React, {Component} from 'react'
import { StyleSheet, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Form, Icon, Header, Left, Title } from 'native-base'
import { UserAuth } from '../../actions/UserActions'

import { styles as main, ivanColor } from '../../Style'
import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'
import { Storage } from '../../utils/deviceServices'


class ChangePassword extends Component {
  constructor(props) {
    super(props)

    this.inputs = {}

    this.state = {
      savedPass:'',
      oldPass: '',
      newPass: '',
      newRePass: '',
      oldPassErr: false,
      newPassErr: false,
      newRePassErr: false,
      isHiddenOldPass: true,
      isHiddenNewPass: true,
      isHiddenNewRePass: true,
      iconOldPass: 'eye-off',
      iconNewPass: 'eye-off',
      iconNewRePass: 'eye-off',
      changing: false
    }

    this._changePass = this._changePass.bind(this)
  }

  async componentWillMount() {
    let password = await Storage.GetItem('password')
    this.setState({ savedPass: password })
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

  _togglePassIcon(item) {
    if (item==='OLD') {
      this.setState(prevState => ({
        iconOldPass: prevState.iconOldPass === 'eye' ? 'eye-off' : 'eye',
        isHiddenOldPass: !prevState.isHiddenOldPass
      }))
    } else if (item==='NEW'){
      this.setState(prevState => ({
        iconNewPass: prevState.iconNewPass === 'eye' ? 'eye-off' : 'eye',
        isHiddenNewPass: !prevState.isHiddenNewPass
      }))
    } else if (item==='NEWRE'){
      this.setState(prevState => ({
        iconNewRePass: prevState.iconNewRePass === 'eye' ? 'eye-off' : 'eye',
        isHiddenNewRePass: !prevState.isHiddenNewRePass
      }))
    }
  }

  _checkParams() {
    st = this.state

    this.setState({ oldPassErr: false, newPassErr: false, newRePassErr: false })

    Keyboard.dismiss()

    if (st.oldPass.length === 0) {
      this.setState({ oldPassErr: true })
      return false
    }

    if (st.oldPass !== st.savedPass) {
      this.setState({ oldPassErr: true })
      ToastTr.Default('Вы ввели неверный текущий пароль')
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
      ToastTr.Default('Новый пароль не совпадает с подтверждением')
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
    const { user, navigation } = this.props
    const { oldPass, newPass, newRePass, oldPassErr, newPassErr, newRePassErr, isHiddenOldPass, isHiddenNewPass, isHiddenNewRePass, iconOldPass, iconNewPass, iconNewRePass} = this.state

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={_=> navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Сменить пароль</Title>
          </Body>
        </Header>
        <Content padder>
          <Form style={styles.form}>
            <Item floatingLabel style={main.mt_0} error={oldPassErr}>
              <Label style={main.fontFam}>Текущий пароль <Text style={main.clOrange}>*</Text></Label>
              <Input secureTextEntry={isHiddenOldPass}
                style={main.mt_5}
                value={oldPass}
                onChangeText={this._oldPass}
                returnKeyType={'next'} 
                autoFocus={true}
                blurOnSubmit={false} 
                getRef={input => { this.inputs[1] = input }}
                onSubmitEditing={_=> this.inputs[2]._root.focus()}
              />
              <Icon name={iconOldPass} onPress={_=> this._togglePassIcon('OLD')} style={main.clIvan}/>
            </Item>

            <Item floatingLabel error={newPassErr}>
              <Label style={main.fontFam}>Новый пароль <Text style={main.clOrange}>*</Text></Label>
              <Input secureTextEntry={isHiddenNewPass}
                style={main.mt_5}
                value={newPass}
                onChangeText={this._newPass}
                returnKeyType={'next'} 
                blurOnSubmit={false} 
                getRef={input => { this.inputs[2] = input }}
                onSubmitEditing={_=> this.inputs[3]._root.focus()} 
              />
              <Icon name={iconNewPass} onPress={_=> this._togglePassIcon('NEW')} style={main.clIvan}/>
            </Item>

            <Item floatingLabel error={newRePassErr}>
              <Label style={main.fontFam}>Подтверждение пароля <Text style={main.clOrange}>*</Text></Label>
              <Input secureTextEntry={isHiddenNewRePass}
                style={main.mt_5}
                value={newRePass}
                onChangeText={this._newRePass}
                getRef={input => { this.inputs[3] = input }}
                onSubmitEditing={this._changePass}
              />
              <Icon name={iconNewRePass} onPress={_=> this._togglePassIcon('NEWRE')} style={main.clIvan}/>
            </Item>
          </Form>

          <Card transparent>
            <CardItem>
              <Body>
                <Button block onPress={this._changePass} style={main.bgGreen}>
                {(user.isLoad)
                  ? <Text>Загрузка...</Text>
                  : <Text>Сохранить</Text>
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

const styles = StyleSheet.create({
  form: {
    alignSelf: 'stretch',
    paddingVertical:10, 
    paddingHorizontal:20
  }
})


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

