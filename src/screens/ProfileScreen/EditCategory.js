import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Form, Header, Left, Icon, Title } from 'native-base'

import { styles as main, ivanColor } from '../../Style'
import { CategoriesActions } from '../../actions/CategoriesActions'
import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'

class EditCategory extends Component {
  constructor(props) {
    super(props)

    this.state = {
      notValid: true,
      Id: -1,
      Name: '',
      IsSpendingCategory: this.props.navigation.getParam('CatType', false),
      Icon: ''
    }

    this._editCategory = this._editCategory.bind(this)
  }

  componentDidMount() {
    let itemid = this.props.navigation.getParam('itemid', -1)

    /* Если редактирование, то необходимо подобрать нужную категорию */
    let item = this.props.categories.Income.find(el => el.Id === itemid)

    if (item == undefined) {
      item = this.props.categories.Expense.find(el => el.Id === itemid)
    }

    if (item != undefined) {
      this.setState({ 
        Id: item.Id, 
        Name: item.Name, 
        IsSpendingCategory: item.IsSpendingCategory, 
        Icon: item.Icon, 
        notValid: (item.Name.length > 0 ) ? false : true
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.categories.isLoad) {
      if(nextProps.categories.Error.length == 0) {
        ToastTr.Success('Категория изменена')
      }
      this.props.navigation.goBack()
    }
  }

  _editCategory() {
    let st = this.state
    this.props.editcategory(st.Id, st.Name, st.IsSpendingCategory, st.Icon)
  }

  _changeName = value => {
    let notValid = true
    if (value.length > 0) {
      notValid = false
    }
    this.setState({ Name: value, notValid: notValid })
  }

  render() {
    const { categories, navigation } = this.props

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={_=> navigation.goBack()}>
              <Icon name='arrow-back'/>
            </Button>
          </Left>
          <Body>
            <Title>Редактировать</Title>
          </Body>
        </Header>
        <Content padder>
          <Card>
            <CardItem>
              <Body>
                <Form style={{alignSelf: 'stretch'}}>
                  <Item stackedLabel last>
                    <Label style={main.fontFam}>Наименование <Text style={main.clOrange}>*</Text></Label>
                    <Input onChangeText={this._changeName} value={this.state.Name}/>
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
                  ? <Text>Загрузка...</Text>
                  : <Text>Сохранить</Text>
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
    editcategory:(Id, Name, IsSpendingCategory, Icon) => {
      dispatch(CategoriesActions.Edit(Id, Name, IsSpendingCategory, Icon))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCategory)