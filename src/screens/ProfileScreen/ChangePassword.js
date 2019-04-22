import React, {Component} from 'react'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label } from 'native-base'

import { styles as mainStyle } from '../../Style'
import { ToastTr } from '../../components/Toast'
import HeaderApp from '../../components/HeaderApp'

export default class ChangePassword extends Component {
  constructor(props) {
    super(props)

    this._changePass = this._changePass.bind(this)
  }

  _changePass() {
    ToastTr.Success('Пароль изменен')
    this.props.navigation.goBack()
  }

  render() {
    return <Container>
            <Content padder>
              <Card>
                <CardItem >
                  <Body>
                    <Item floatingLabel>
                      <Label>Текущий пароль</Label>
                      <Input secureTextEntry={true}/>
                    </Item>
                  </Body>
                </CardItem>
                <CardItem >
                  <Body>
                    <Item floatingLabel>
                      <Label>Новый пароль</Label>
                      <Input secureTextEntry={true}/>
                    </Item>
                  </Body>
                </CardItem>
                <CardItem >
                  <Body>
                    <Item floatingLabel>
                      <Label>Подтверждение пароля</Label>
                      <Input secureTextEntry={true}/>
                    </Item>
                  </Body>
                </CardItem>
              </Card>

              <Card transparent>
                <CardItem>
                  <Body>
                    <Button success block onPress={this._changePass}>
                      <Text>Сохранить</Text>
                    </Button>
                  </Body>
                </CardItem>
              </Card>
            </Content>
          </Container>
        }
}
