import React, {Component} from 'react'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Form } from 'native-base'
import { styles as main } from '../../Style'

export default class ForgotPass extends Component {
  render() {
      return <Container>
              <Content padder>
                <Card transparent style={main.aI_C}>
                  <CardItem>
                    <Text style={[main.txtAl_c, main.fontFam]}>Введите email или логин, который вы используете для входа. Мы вышлем письмо с инструкцией.</Text>
                  </CardItem>
                 </Card>
                <Card transparent>
                  <CardItem>
                    <Body>
                      <Form style={{alignSelf: 'stretch'}}>
                        <Item floatingLabel style={main.mt_0}>
                          <Label style={main.fontFam}>Email или логин</Label>
                          <Input style={[main.clGrey, main.fontFam, main.mt_5]}/>
                        </Item>
                      </Form>
                    </Body>
                  </CardItem>
                </Card>
                <Card transparent>
                  <CardItem>
                    <Body>
                      <Button block style={main.bgGreen}>
                        <Text style={main.fontFam}>Отправить</Text>
                      </Button>
                    </Body>
                  </CardItem>
                </Card>
              </Content>
            </Container>
  }
}