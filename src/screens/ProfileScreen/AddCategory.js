import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Form } from 'native-base'

import { styles as main, ivanColor } from '../../Style'
import { CategoriesActions } from '../../actions/CategoriesActions'
import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'

class AddCategory extends Component {
  constructor(props) {
    super(props)

    this.state = {
      notValid: true,
      Id: -1,
      Name: '',
      IsSpendingCategory: this.props.navigation.getParam('CatType', false),
      CreatedBy: null,
      Icon: ''
    }

    this._editCategory = this._editCategory.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.categories.isLoad) {
      
      if(nextProps.categories.Error.length == 0) {
        ToastTr.Success('Категория создана')
      }
      this.props.navigation.goBack()
    }
  }

  _editCategory() {
    let st = this.state
    this.props.addcategory(this.props.user.UserId, st.Name, st.IsSpendingCategory)
  }

  _changeName = value => {
    let notValid = true
    if (value.length > 0) {
      notValid = false
    }
    this.setState({ Name: value, notValid: notValid })
  }

  render() {
    const { categories } = this.props

    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem>
              <Body>
                <Form style={{alignSelf: 'stretch'}}>
                  <Item floatingLabel style={main.mt_0}>
                    <Label style={main.fontFam}>Наименование</Label>
                    <Input onChangeText={this._changeName} value={this.state.Name} style={[main.clGrey, main.fontFam, main.mt_5]}/>
                  </Item>
                </Form>
              </Body>
            </CardItem>
          </Card>
          <Card transparent>
            <CardItem>
              <Body>
                <Button disabled={this.state.notValid} style={(this.state.notValid) ? {} : main.bgGreen} block onPress={this._editCategory}>
                {(categories.isLoad)
                  ? <Text style={main.fontFam}>Загрузка...</Text>
                  : <Text style={main.fontFam}>Создать</Text>
                }
                </Button>
              </Body>
            </CardItem>
          </Card>
        </Content>

        <ModalLoading isActive={categories.isLoad} color={ivanColor} />

      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    categories: state.Categories,
    user: state.User
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addcategory:(UserId, Name, IsSpendingCategory) => {
      dispatch(CategoriesActions.Add(UserId, Name, IsSpendingCategory))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCategory)