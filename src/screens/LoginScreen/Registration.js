import React, {Component} from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Button, Text, Input, Icon, Item, Label, Form, Header, Left, Body, Title } from 'native-base'
import { LinearGradient } from 'expo'

import ModalLoading from '../../components/ModalLoading'
import { ToastTr } from '../../components/Toast'
import { UserAuth } from '../../actions/UserActions'
import { validateEmail } from '../../utils/utils.js'
import { styles as main, ivanColor } from '../../Style'


class Registration extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Login: '',
      Email: '',
      Password: '',
      RePassword: '',
      errLogin: false,
      errPass: false,
      errEmail: false,
      errRePass: false,
      isHiddenPass: true,
      isHiddenRePass: true,
      iconPass: 'eye-off',
      iconRePass: 'eye-off',
    }

    this._registration = this._registration.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.user.Error.length > 0) {
      ToastTr.Danger(nextProps.user.Error)
    } else if (nextProps.user.UserId.length > 0) {
      this.props.navigation.navigate('FirstSettings')
    }
  }

  _changeLogin = value => {
    this.setState({Login: value})
  }

  _changeEmail = value => {
    this.setState({Email: value})
  }

  _changePass = value => {
    this.setState({Password: value})
  }

  _changeRePass = value => {
    this.setState({RePassword: value})
  }

  _toggleIcon(item){
    if (item==='PASS'){
      this.setState(prevState => ({
        iconPass: prevState.iconPass === 'eye' ? 'eye-off' : 'eye',
        isHiddenPass: !prevState.isHiddenPass
      }))
    } else {
      this.setState(prevState => ({
        iconRePass: prevState.iconRePass === 'eye' ? 'eye-off' : 'eye',
        isHiddenRePass: !prevState.isHiddenRePass
      }))
    }
  }

  _checkParams() {
    st = this.state

    if (st.Login.length == 0) {
      this.setState({ errLogin: true })
      return false
    }
    if (st.Email.length == 0) {
      this.setState({ errEmail: true })
      return false
    }
    if (st.Password.length == 0) {
      this.setState({ errPass: true })
      return false
    }
    if (st.RePassword.length == 0) {
      this.setState({ errRePass: true })
      return false
    }

    if(validateEmail(st.Email) === false)
    {
      this.setState({ errEmail: true })
      ToastTr.Danger('Email is Not Correct')
      return false
    }

    if(st.Password != st.RePassword) {
      this.setState({ errPass: true, errRePass: true })
      ToastTr.Danger('Пароли не совпадают')
      return false 
    }

    return true
  }

  _registration() {
    if(this._checkParams()) {
      this.props.goToReg(this.state.Login, this.state.Email, this.state.Password)
    }
  }

  render() {
      const { user, navigation } = this.props
      const { errLogin, errEmail, errPass, errRePass, isHiddenPass, iconPass, isHiddenRePass, iconRePass } = this.state

      return (
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={_=> navigation.goBack()}>
                <Icon name='arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>Регистрация</Title>
            </Body>
          </Header>
          <LinearGradient colors={[ivanColor, ivanColor, '#30cfd0']} style={main.fl_1} >
            <Content padder>
              <Form style={styles.form}>
                <Item floatingLabel error={errLogin} style={main.mt_0} >
                  <Label style={main.clWhite}>Логин</Label>
                  <Input onChangeText={this._changeLogin} maxLength={20} style={styles.input}/>
                </Item>

                <Item floatingLabel error={errEmail}>
                  <Label style={main.clWhite}>Email</Label>
                  <Input onChangeText={this._changeEmail} style={styles.input}/>
                </Item>

                <Item floatingLabel error={errPass}>
                  <Label style={main.clWhite}>Пароль</Label>
                  <Input secureTextEntry={isHiddenPass} onChangeText={this._changePass} maxLength={20} style={styles.input}/>
                  <Icon name={iconPass} onPress={_=> this._toggleIcon('PASS')} style={main.clWhite}/>
                </Item>

                <Item floatingLabel error={errRePass}>
                  <Label style={main.clWhite}>Подтверждение пароля</Label>
                  <Input secureTextEntry={isHiddenRePass} onChangeText={this._changeRePass} maxLength={20} style={styles.input} onSubmitEditing={this._registration}/>
                  <Icon name={iconRePass} onPress={_=> this._toggleIcon('REPASS')} style={main.clWhite}/>
                </Item>

                <Button block light onPress={this._registration} style={{marginTop: 30}}>
                {(user.isLoad)
                ? <Text>Загрузка...</Text>
                : <Text>Далее</Text>
                }
                </Button>
                
              </Form>
            </Content>
          </LinearGradient>

          <ModalLoading isActive={user.isLoad} />

        </Container>
      )
  }
}

const styles = StyleSheet.create({
  input: {
    ...main.clWhite,
    ...main.mt_5
  },
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
    goToReg:(Login, Email, Password) => {
      dispatch(UserAuth.Registration(Login, Email, Password))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration)