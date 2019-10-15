import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Form, Header, Left, Icon, Title } from 'native-base'
import { UserAuth } from '../../actions/UserActions'

import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'
import { validateEmail } from '../../utils/utils'
import { styles as main, ivanColor } from '../../Style'


class ForgotPass extends Component {
  constructor(props) {
    super(props)

    this.state = {
      UserField: '',
      err: false,
      isDisabledButton: true,
      newPassCnt: this.props.user.newPassCnt
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.user.Error.length > 0) {
      ToastTr.Danger(nextProps.user.Error)
    } else if (nextProps.user.UserId.length > 0) {
      this.props.navigation.navigate('ForgotPassInfo')
    }
  }


  _changeEmailLogin = value => {
    let DisabledButton = true
    if (value.length > 0) {
      DisabledButton = false
    }
    this.setState({UserField: value, isDisabledButton: DisabledButton})
  }

  _forgotPass = () => {
    const { UserField } = this.state
    /*Если прошел валидацию, значит юзер указал мыло иначе считаем что логин */
    if (validateEmail(UserField)) {
      this.props.forgotPass(null, UserField)
    } else {
      this.props.forgotPass(UserField, null)
    }
  }

  render() {
    const { UserField, err, isDisabledButton } = this.state
    const { user, navigation } = this.props

      return (
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={_=> navigation.navigate('Login')}>
                <Icon name='arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>Восстановление пароля</Title>
            </Body>
          </Header>
          <Content padder>
            <Card transparent style={main.aI_C}>
              <CardItem>
                <Text style={main.txtAl_c}>Введите email или логин, который вы используете для входа. Мы вышлем на вашу почту письмо с инструкцией.</Text>
              </CardItem>
            </Card>
            <Card transparent>
              <CardItem>
                <Body>
                  <Form style={{alignSelf: 'stretch'}}>
                    <Item floatingLabel style={main.mt_0} error={err}>
                      <Label style={main.fontFam}>Email или логин <Text style={main.clOrange}>*</Text></Label>
                      <Input onChangeText={this._changeEmailLogin} style={main.mt_5} value={UserField} onSubmitEditing={this._forgotPass}/>
                    </Item>
                  </Form>
                </Body>
              </CardItem>
            </Card>
            <Card transparent>
              <CardItem>
                <Body>
                  <Button block style={(isDisabledButton) ? {} : main.bgGreen} disabled={isDisabledButton} onPress={this._forgotPass}>
                    {(user.isLoad)
                      ? <Text>Загрузка...</Text>
                      : <Text>Отправить</Text>
                      }
                  </Button>
                </Body>
              </CardItem>
            </Card>
          </Content>
          
          <ModalLoading isActive={(user.isLoad)} color={ivanColor} />

        </Container>
      )
  }
}

const mapStateToProps = state => {
  return {
    user: state.User,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    forgotPass: (login, email) => {
      dispatch(UserAuth.forgotPassword(login, email))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPass)