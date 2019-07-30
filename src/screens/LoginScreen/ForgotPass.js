import React, {Component} from 'react'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Form } from 'native-base'
import { styles as main } from '../../Style'

export default class ForgotPass extends Component {
  render() {
      return <Container>
              <Content padder>
                <Card>
                  <CardItem>
                    <Body>
                      <Form style={{alignSelf: 'stretch'}}>
                        <Item floatingLabel>
                          <Label style={main.fontFam}>Email</Label>
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