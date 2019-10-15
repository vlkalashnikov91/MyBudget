import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Form, Header, Left, Icon, Title } from 'native-base'
import { UserAuth } from '../actions/UserActions'

import { styles as main, ivanColor } from '../Style'
import { ToastTr } from '../components/Toast'
import { onlyNumbers } from '../utils/utils'


class TempPass extends Component {
    constructor(props) {
        super(props)

        //Array [1, 2, 3, 4] - объект inputs состоит из таких айдишников за которыми закреплены инпуты
        this.inputs = {}

        this.state = {
          letter1: '',
          letter2: '',
          letter3: '',
          letter4: '',
        }
        

    }

    
    focusTheField = (id) => {
        const cnt = Object.keys(this.inputs).map(item => parseInt(item, 10))
        if (cnt.includes(id)) {
            this.inputs[id]._root.focus()
        }
    }

    _pastePass = (val, idx) => {
        if (val.length === 0) {
            this.setState({ ["letter"+idx]: '' })
        } else {
            if (onlyNumbers(val)) {
                this.setState({ ["letter"+idx]: val })
                this.focusTheField(idx+1)
            }
        }
    }

    _checkLetter = idx => {
        var beforeLetter = this.state['letter'+(idx-1)]
        /*Если предыдущее поле еще пустое то не давать устанавливать курсор */
        if (beforeLetter.length === 0) {
            this.focusTheField(idx-1)
            return
        }
    }

    _checkTempPass() {
        
    }


    render() {
        const { navigation, user} = this.props
        const { letter1, letter2, letter3, letter4 } = this.state

        const isDisabledButton = ((letter1.length===0)||(letter2.length===0)||(letter3.length===0)||(letter4.length===0))

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={_=> navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Восстановление пароля</Title>
                    </Body>
                </Header>
                <Content padder>
                    <Card transparent style={main.aI_C}>
                        <CardItem>
                            <Text style={main.txtAl_c}>Вам было направлено письмо на почту с временным паролем. Введите его ниже</Text>
                        </CardItem>
                    </Card>
                    <Card transparent>
                        <CardItem>
                            <Body>
                                <Form style={{alignSelf: 'stretch', flex:1, flexDirection:'row', paddingHorizontal:50}}>
                                    <Input 
                                        textAlign={'center'}
                                        keyboardType="number-pad"
                                        placeholderTextColor={ivanColor}
                                        placeholder="-"
                                        maxLength={1}
                                        onChangeText={e=>this._pastePass(e, 1)}
                                        value={letter1}
                                        style={{fontSize:33}}
                                        returnKeyType={'next'}
                                        ref={input => { this.inputs[1] = input }}
                                        blurOnSubmit={false}
                                        autoFocus={true}
                                        //onFocus={_=> this._checkLetter(1)}
                                    />
                                    <Input
                                        textAlign={'center'}
                                        keyboardType="number-pad"
                                        placeholderTextColor={ivanColor}
                                        placeholder="-"
                                        maxLength={1}
                                        onChangeText={e=>this._pastePass(e, 2)}
                                        value={letter2}
                                        style={{fontSize:33}}
                                        returnKeyType={'next'}
                                        ref={input => { this.inputs[2] = input }}
                                        blurOnSubmit={false}
                                        onFocus={_=> this._checkLetter(2)}
                                    />
                                    <Input
                                        textAlign={'center'}
                                        keyboardType="number-pad"
                                        placeholderTextColor={ivanColor}
                                        placeholder="-"
                                        maxLength={1}
                                        onChangeText={e=>this._pastePass(e, 3)}
                                        value={letter3}
                                        style={{fontSize:33}}
                                        returnKeyType={'next'}
                                        ref={input => { this.inputs[3] = input }}
                                        blurOnSubmit={false}
                                        onFocus={_=> this._checkLetter(3)}
                                    />
                                    <Input
                                        textAlign={'center'}
                                        keyboardType="number-pad"
                                        placeholderTextColor={ivanColor}
                                        placeholder="-"
                                        maxLength={1}
                                        onChangeText={e=>this._pastePass(e, 4)}
                                        value={letter4}
                                        style={{fontSize:33}}
                                        ref={input => { this.inputs[4] = input }}
                                        blurOnSubmit={false}
                                        onFocus={_=> this._checkLetter(4)}
                                    />
                                </Form>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card transparent>
                        <CardItem>
                            <Body style={{paddingTop:20}}>
                                <Button block style={(isDisabledButton) ? {} : main.bgGreen} disabled={isDisabledButton} onPress={this._checkTempPass}>
                                {(user.isLoad)
                                ? <Text>Загрузка...</Text>
                                : <Text>Далее</Text>
                                }
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
      user: state.User,
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      checkUser: (UserId) => {
        dispatch(UserAuth.CheckUser(UserId))
      },
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(TempPass)