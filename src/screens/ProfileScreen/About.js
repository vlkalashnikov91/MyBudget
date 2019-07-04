import React, {Component} from 'react'
import { Image, StyleSheet, Clipboard } from 'react-native'
import { Container, Button, Text } from 'native-base'
import { Row, Grid } from 'react-native-easy-grid'
import { styles as main, screenHeight, screenWidth } from '../../Style'
import { ToastTr } from '../../components/Toast'

const mail = 'T2k.ivan@gmail.com'

export default class About extends Component {
    _copyMail() {
        Clipboard.setString(mail)
        ToastTr.Default('Скопировано в буфер')
    }

  render() {
    return (
        <Container>
            <Grid style={[main.jC_C, {height: screenHeight/2.5}]}>
                <Row size={20} style={[main.jC_C, main.aI_C, main.fD_C]}>
                    <Image resizeMode='contain' resizeMethod='scale' style={styles.Logo} source={require('../../../assets/Logo.png')}></Image>
                    <Text>Версия 1.0.1</Text>
                </Row>
                <Row size={25} style={[main.jC_C, main.aI_C, main.fD_C]}>
                    <Text>Мы на связи</Text>
                    <Button transparent block onPress={this._copyMail}>
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
  