import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Text } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'

import { styles as main } from '../Style'
import { SummMask } from '../utils/utils'


class BalanceInfo extends Component {
    render() {
        const {payments, user } = this.props
        var balance = 0
        var planed = 0

        if ((payments.Payments != undefined) && (payments.Payments.length > 0)) {
            payments.Payments.map(item => {
                if (item.IsPlaned == false) {
                    if (item.IsSpending) {
                        balance = balance - item.Amount
                    } else {
                        balance = balance + item.Amount
                    }
                }

                if (item.IsSpending) {
                    planed = planed - item.Amount
                } else {
                    planed = planed + item.Amount
                }
            })
        }

        return (
            <Grid style={{paddingBottom:10}}>
                <Row>
                    <Col style={main.clWhite}>
                        <Row style={[main.jC_C, main.aI_C]}>
                            <Text style={[main.clWhite, main.fontFam, {fontSize:13}]}>Баланс</Text>
                        </Row>
                    </Col>
                    <Col>
                        <Row style={[main.jC_C, main.aI_C]}>
                            <Text style={[main.clWhite, main.fontFam, {fontSize:13}]}>Плановый</Text>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row style={[main.jC_C, main.aI_C]}>
                            <Text style={[main.clWhite, main.fontFam, main.fontW_B]}>{SummMask(balance)} {user.DefCurrency}</Text>
                        </Row>
                    </Col>
                    <Col>
                        <Row style={[main.jC_C, main.aI_C]}>
                            <Text style={[main.clWhite, main.fontFam]}>{SummMask(planed)} {user.DefCurrency}</Text>
                        </Row>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.User,
        categories: state.Categories,
        payments: state.Payments
    }
  }

export default connect(mapStateToProps)(BalanceInfo)