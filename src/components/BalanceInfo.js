import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Text } from 'native-base'

import { Col, Row, Grid } from 'react-native-easy-grid'

import { styles as mainStyle } from '../Style'

class BalanceInfo extends Component {
    render() {
        const {payments, user } = this.props
        var balance = 0
        var planed = 0

        if ((payments.Payments != undefined) && (payments.Payments.length > 0)) {
            payments.Payments.map(item => {
                if (item.IsPlaned == false) {
                    balance = balance + item.Amount
                }
                planed = planed + item.Amount
            })
        }

        return (
            <Grid>
                <Row>
                    <Col style={mainStyle.headerTitleStyle}>
                        <Row style={mainStyle.rowStyle}>
                            <Text style={mainStyle.headerTitleStyle}>Баланс</Text>
                        </Row>
                    </Col>
                    <Col>
                        <Row style={mainStyle.rowStyle}>
                        <Text style={mainStyle.headerTitleStyle}>Плановый</Text>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row style={mainStyle.rowStyle}>
                            <Text style={mainStyle.headerTitleStyle}>{balance} {user.DefCurrency}</Text>
                        </Row>
                    </Col>
                    <Col>
                        <Row style={mainStyle.rowStyle}>
                            <Text style={mainStyle.headerTitleStyle}>{planed} {user.DefCurrency}</Text>
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
      payments: state.Payments
    }
  }

export default connect(mapStateToProps)(BalanceInfo)