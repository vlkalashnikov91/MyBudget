import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-native'
import { Container, Body, Content, Button, Text, Icon, Card, CardItem, Item, Label, Picker } from 'native-base'

import { ChangeSettings } from '../../actions/UserActions'


class FirstSettings extends Component {
  constructor(props) {
    super(props)

    this.state = {
        DefCurrency: "₸",
        CarryOverRests: false,
    }
}

componentWillReceiveProps(nextProps) {
    this.props.navigation.navigate('Home')
}

_changeCurrency(value) {
    this.setState({ DefCurrency: value })
}

_balanceTransfer(value) {
    this.setState({ CarryOverRests: value })
}

setModalVisible = () => {
    Alert.alert(
        'Перенос остатка',
        'Если у Вас остались средства на балансе за прошлый месяц, они появятся как доход в новом месяце',
        [
        {text: 'OK'},
        ]
    )
}

_saveSettings() {
    let st = this.state
    this.props.changesettings(st.DefCurrency, st.CarryOverRests, st.UseTemplates)
}

render() {
    const { user } = this.props

    return <Container>
              <Content>
                <Card transparent style={{ alignItems: 'center' }}>
                  <CardItem>
                    <Text>Для комфортного использования предлагаем установить первоначальные настройки</Text>
                  </CardItem>
                 </Card>
                 <Card transparent style={{ alignItems: 'center' }}>
                    <CardItem bordered>
                        <Body>
                            <Item picker>
                                <Label>Валюта по умолчанию</Label>
                                <Picker mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.DefCurrency}
                                    onValueChange={this._changeCurrency.bind(this)}
                                >
                                    <Picker.Item label="₸" value="₸" />
                                    <Picker.Item label="$" value="$" />
                                    <Picker.Item label="€" value="€" />
                                </Picker>
                            </Item>

                            <Item picker>
                                <Label>Перенос остатка</Label>
                                <Icon name='ios-information-circle' style={{color: '#384850'}} button onPress={this.setModalVisible} />
                                <Picker mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.CarryOverRests}
                                    onValueChange={this._balanceTransfer.bind(this)}
                                >
                                    <Picker.Item label="Да" value={true} />
                                    <Picker.Item label="Нет" value={false} />
                                </Picker>
                            </Item>

                            <Text>* вы можете изменить эти настройки в любой момент в личном кабинете</Text>

                        </Body>
                    </CardItem>
                 </Card>
                 {(user.isLoad)
                ? <Spinner />
                : <Card transparent>
                    <CardItem>
                        <Body>
                            <Button block success onPress={() => this._saveSettings()}>
                                <Text>Продолжить</Text>
                            </Button>
                        </Body>
                    </CardItem>
                 </Card>
                }
              </Content>
            </Container>
  }
}

const mapStateToProps = state => {
  return {
    user: state.User
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changesettings:(DefCurrency, UseTemplates, CarryOverRests) => {
        dispatch(ChangeSettings(DefCurrency, UseTemplates, CarryOverRests))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FirstSettings)