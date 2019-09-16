import React, {Component} from 'react'
import { Alert, ListView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { Body, Left, Button, Text, ListItem, List, Icon, Right, Spinner } from 'native-base'

import { PaymentActions } from '../actions/PaymentActions'
import { styles as main } from '../Style'
import { SummMask } from '../utils/utils'


class ListPays extends Component {
    constructor(props) {
      super(props)

      this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

      this.state = {
        planedPay: -1,
      }

      this._definePayCat = this._definePayCat.bind(this)

    }

    componentWillReceiveProps() {
      this.setState({ planedPay: -1 })
    }

    _choosePayments(item) {
      this.setState({ planedPay: item.Id })
      this.props.editpayment(item.Id, item.CategoryId, item.Amount, item.Name, item.TransDate, item.IsSpending, !item.IsPlaned) 
    }

    _deletePay(data, secId, rowId, rowMap) {
      Alert.alert(
          `${data.Name}`,
          'Удалить платеж?',
          [
            {text: 'Нет', onPress: ()=> {
                  rowMap[`${secId}${rowId}`].props.closeRow()
              }
            },
            {text: 'Да', onPress: ()=> {
                  rowMap[`${secId}${rowId}`].props.closeRow()
                  this.props.deletepayment(data.Id)
              }
            },
          ]
        )
    }

    _definePayCat(item) {
      if (item.CategoryId == null) {
        return { Name:'Не указано', IsSpendingCategory: item.IsSpending } 
      } else {
        let CatDesc = this.props.categories.Income.find(el => el.Id === item.CategoryId)

        if (CatDesc == undefined) {
          CatDesc = this.props.categories.Expense.find(el => el.Id === item.CategoryId)
        }
        return CatDesc
      }
    }

    render() {
      const { user, payments } = this.props

      return (
        <List 
            rightOpenValue={-75}
            disableRightSwipe={true}
            dataSource={this.ds.cloneWithRows(payments)}
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger onPress={_=> this._deletePay(data, secId, rowId, rowMap) }>
                <Icon active name="trash" />
              </Button>
            }
            renderRow={value => {
              let CatDesc = this._definePayCat(value)

              return (
                <ListItem key={value.Id} icon>
                  <Left button onPress={_=> this._choosePayments(value)}>
                    {(this.state.planedPay === value.Id)
                    ? <Button rounded light style={main.ml_10} ><Spinner size="small"/></Button>
                    : <Button rounded bordered
                      success={(!value.IsPlaned)} 
                      light={(value.IsPlaned)} 
                      style={main.ml_10}
                      onPress={_=> this._choosePayments(value)}>
                        <Icon ios="ios-checkmark" android="md-checkmark"/>
                    </Button>
                    }
                  </Left>
                  <Body>
                    <TouchableOpacity onPress={_=> this.props.GoToEdit(value.Id)}>
                      {((value.Name==null) || (value.Name.length === 0))
                      ? <Text style={main.clGrey}>---</Text>
                      : <Text style={main.clGrey} numberOfLines={1}>{value.Name}</Text>
                      }
                      <Text note>{CatDesc.Name}</Text>
                    </TouchableOpacity>
                  </Body>
                  <Right style={[main.fD_C, {alignItems:'flex-end'}]}>
                    {(CatDesc.IsSpendingCategory) 
                    ? <Text style={main.clIvanD}> - {SummMask(value.Amount)} {user.DefCurrency}</Text>
                    : <Text style={main.clIvanG}> + {SummMask(value.Amount)} {user.DefCurrency}</Text>
                    }
                    <Text note>{moment(value.TransDate).format('DD.MM.YYYY')}</Text>
                  </Right>
                </ListItem>
              )
            }}
        >
        </List>
      )
    }
}

const mapStateToProps = state => {
  return {
    user: state.User,
    categories: state.Categories,
  }
}

const mapDispatchToProps = dispatch => {
    return {
      deletepayment: (id) => dispatch(PaymentActions.Delete(id)),
      editpayment: (Id, CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned) => {
        dispatch(PaymentActions.Edit(Id, CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned))
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(ListPays)