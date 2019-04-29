import React, {Component} from 'react'
import { Header, Body, Title, Right, Left, Button, Icon } from 'native-base'

export default class HeaderApp extends Component {
    render() {
        return (
            <Header>
            {
                (this.props.leftIcon != undefined) &&
                <Left>
                    <Button transparent onPress={this.props.leftFunc}>
                        <Icon name={this.props.leftIcon} />
                    </Button>
                </Left>
            }
            <Body>
            {
                (this.props.title == undefined)
                ? <Title>MyBudget</Title>
                : <Title>{this.props.title}</Title>
            }
            </Body>
            {
                (this.props.rightIcon != undefined) &&
                <Right>
                    <Button transparent onPress={this.props.rightFunc}>
                        <Icon name={this.props.rightIcon} style={{fontSize:30}} />
                    </Button>
                </Right>
            }
            </Header>
        )
    }
  }
  