import React, {Component} from 'react'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Form, Header, Left, Icon, Title } from 'native-base'

import { styles as main } from '../../Style'
import { validateEmail } from '../../utils/utils.js'
import { ToastTr } from '../../components/Toast'


export default class ForgotPass extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Email: '',
      errEmail: false,
      isDisabledButton: true
    }
  }

  _changeEmail = value => {
    let DisabledButton = true
    if (value.length > 0) {
      DisabledButton = false
    }
    this.setState({Email: value, isDisabledButton: DisabledButton})
  }

  _checkParams() {
    st = this.state
    
    if (st.Email.length == 0) {
      this.setState({ errEmail: true })
      return false
    }
    if(validateEmail(st.Email) === false)
    {
      this.setState({ errEmail: true })
      ToastTr.Danger('Email is Not Correct')
      return false
    }

    return true
  }

  render() {
      return (
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={_=> this.props.navigation.goBack()}>
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
                    <Item floatingLabel style={main.mt_0} error={this.state.errEmail}>
                      <Label>Email или логин</Label>
                      <Input onChangeText={this._changeEmail} style={main.mt_5}/>
                    </Item>
                  </Form>
                </Body>
              </CardItem>
            </Card>
            <Card transparent>
              <CardItem>
                <Body>
                  <Button block style={(this.state.isDisabledButton) ? {} : main.bgGreen} disabled={this.state.isDisabledButton}>
                    <Text>Отправить</Text>
                  </Button>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </Container>
      )
  }
}