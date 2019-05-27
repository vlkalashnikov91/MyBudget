import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-native'
import { Container, Body, Content, Button, Text, Icon, Card, CardItem, Item, Label, Picker, Spinner } from 'native-base'

import { UserAuth } from '../../actions/UserActions'
import { styles as main } from '../../Style'

class FirstSettings extends Component {
  constructor(props) {
    super(props)

    this.state = {
        DefCurrency: "₸",
        CarryOverRests: false,
    }

    this._changeCurrency = this._changeCurrency.bind(this)
    this._balanceTransfer = this._balanceTransfer.bind(this)
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
    const { CarryOverRests, DefCurrency } = this.state

    return <Container>
              <Content>
                <Card transparent style={main.aI_C}>
                  <CardItem>
                    <Text style={main.txtAl_c}>Для комфортного использования предлагаем установить первоначальные настройки</Text>
                  </CardItem>
                 </Card>
                 <Card transparent style={main.aI_C}>
                    <CardItem>
                        <Body style={[main.fD_R, main.aI_C]}>
                            <Label style={main.width_65prc}>Валюта по умолчанию</Label>
                            <Item picker style={main.width_30prc}>
                                <Picker mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={DefCurrency}
                                    onValueChange={this._changeCurrency}
                                >
                                    <Picker.Item label="₸" value="₸" />
                                    <Picker.Item label="$" value="$" />
                                    <Picker.Item label="€" value="€" />
                                </Picker>
                            </Item>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Body style={[main.fD_R, main.aI_C]}>
                            <Label style={main.width_65prc}>
                                Перенос остатка  <Icon name='information-circle' style={main.clGrey} button onPress={this.setModalVisible} />
                            </Label>
                            <Item picker style={main.width_30prc}>
                                <Picker mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={CarryOverRests}
                                    onValueChange={this._balanceTransfer}
                                >
                                    <Picker.Item label="Да" value={true} />
                                    <Picker.Item label="Нет" value={false} />
                                </Picker>
                            </Item>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text style={main.txtAl_c} note>* вы можете изменить эти настройки в любой момент в личном кабинете</Text>
                        </Body>
                    </CardItem>
                </Card>
                <Card transparent>
                    <CardItem>
                        <Body>
                            <Button block style={main.bgGreen} onPress={this._saveSettings}>
                                <Text>Продолжить</Text>
                            </Button>
                        </Body>
                    </CardItem>
                </Card>
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
        dispatch(UserAuth.ChangeSettings(DefCurrency, UseTemplates, CarryOverRests))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FirstSettings)