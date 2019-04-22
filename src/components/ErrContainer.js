import React, {Component} from 'react'
import { Container, Content, Text, Button } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { FontAwesome } from '@expo/vector-icons'

export default class ErrContainer extends Component {
    render() {
        return (
            <Container>
                <Content padder> 
                    <Grid>
                        <Row style={{justifyContent:'center'}}>
                            <Button block transparent onPress={this.props.refreshFunc}>
                                <FontAwesome name='repeat' size={30} style={{color:'#609AD3'}} />
                            </Button>
                        </Row>
                        <Row style={{justifyContent:'center'}}>
                            <Text style={{color:'#609AD3'}}>Упс, что-то пошло не так...</Text>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        )
    }
}