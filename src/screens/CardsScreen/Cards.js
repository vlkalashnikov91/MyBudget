import React, {Component} from 'react'
import { RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Spinner,  } from 'native-base'

import { ToastTr } from '../../components/Toast'
import CardInfo from '../../components/CardInfo'
import { TargetActions } from '../../actions/TargetActions'

class Cards extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected1: undefined,
      selected2: undefined,
      paymentsARR: [],
      refreshing: false,
    }

    this._refreshData = this._refreshData.bind(this)
    this._deleteItems = this._deleteItems.bind(this)
    this._editItem = this._editItem.bind(this)
    this._addTarget = this._addTarget.bind(this)
    this._addMyDebt = this._addMyDebt.bind(this)
    this._addOweme = this._addOweme.bind(this)
  }

  componentDidMount(){
    this.props.navigation.setParams({ refreshData: this._refreshData })
    this.props.getTargetDebtList(this.props.user.UserId)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.targetDebts.Error.length > 0) {
      ToastTr.Danger(nextProps.targetDebts.Error)
    }
  }

  _refreshData() {
    this.props.getTargetDebtList(this.props.user.UserId)
  }

  _deleteItems(itemId){
    this.props.deletecard(itemId)
    ToastTr.Success('Удалено')
  }

  _addTarget() {
    this.props.navigation.navigate('AddEditItem', {type: 1})
  }

  _addMyDebt() {
    this.props.navigation.navigate('AddEditItem', {type: 2})
  }

  _addOweme() {
    this.props.navigation.navigate('AddEditItem', {type: 3})
  }

  _editItem(itemId){
    this.props.navigation.navigate('AddEditItem', {type: 0, itemid: itemId})
  }

  render() {
    const { targetDebts, user } = this.props

    if (targetDebts.isLoad) {
      return <Spinner />
    }

    var target = []
    var oweme = []
    var mydebt = []

    targetDebts.Targets.map(item => {
      if (item.Type == 1) {
        target.push(item)
      } else if (item.Type == 2) {
        oweme.push(item)
      } else if (item.Type == 3) {
        mydebt.push(item)
      }
    })

    return (
        <Container>
          <Content
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._refreshData}
              />
            }
          >
            <CardInfo itemtype={1} currency={user.DefCurrency} data={target} dropItem={this._deleteItems} editItem={this._editItem} addItem={this._addTarget}/>
            <CardInfo itemtype={2} currency={user.DefCurrency} data={oweme} dropItem={this._deleteItems} editItem={this._editItem} addItem={this._addMyDebt}/>
            <CardInfo itemtype={3} currency={user.DefCurrency} data={mydebt} dropItem={this._deleteItems} editItem={this._editItem} addItem={this._addOweme}/>
          </Content>
        </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    targetDebts: state.TargetDebts,
    user: state.User
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deletecard:(Id) => {
      dispatch(TargetActions.Delete(Id))
    },
    getTargetDebtList:(UserId)=> {
      dispatch(TargetActions.Get(UserId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards)