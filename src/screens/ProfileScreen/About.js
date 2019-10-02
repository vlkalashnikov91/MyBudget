import React, {Component} from 'react'
import { Image, StyleSheet, Linking } from 'react-native'
import { Container, Button, Text, Header, Icon, Body, Title, Left } from 'native-base'
import { Row, Grid } from 'react-native-easy-grid'
import { styles as main, screenHeight, screenWidth } from '../../Style'
import { ToastTr } from '../../components/Toast'

const mail = 'MyBudgetTeam@yandex.kz'


export default class About extends Component {
    _openMail() {
        var url = `mailto: ${mail}`
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    ToastTr.Default('Отсутствует приложение для отправки писем')
                } else {
                    return Linking.openURL(url)
                }
            })
            .catch((err) => console.error('An error occurred', err))
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
                    <Title>О приложении</Title>
                </Body>
            </Header>
            <Grid style={[main.jC_C, {height: screenHeight/2.5}]}>
                <Row size={20} style={[main.jC_C, main.aI_C, main.fD_C]}>
                    <Image resizeMode='contain' resizeMethod='scale' style={styles.Logo} source={require('../../../assets/Logo.png')}></Image>
                    <Text>Версия 1.0.1</Text>
                </Row>
                <Row size={25} style={[main.jC_C, main.aI_C, main.fD_C]}>
                    <Text>Мы на связи</Text>
                    <Button transparent block onPress={this._openMail}>
                        <Text uppercase={false}>{mail}</Text>
                    </Button>
                </Row>
            </Grid>
        </Container>
    )
  }
}

const styles = StyleSheet.create({
    Logo: {
        width: screenWidth / 1.8, 
        height: 55,
        marginBottom: 20
    }
  })
  