import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Svg } from 'expo'
import { PieChart } from 'react-native-svg-charts'
import { Container, Body, Content, Picker, ListItem, Text, List, Card, CardItem, Left, Icon, Right, Spinner, Segment } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'
 
import { styles as mainStyle } from '../../Style'

import { GraphActions } from '../../actions/GraphActions'
import { HeaderPicker } from '../../components/HeaderPicker'
import { ToastTr } from '../../components/Toast'

class Graphics extends Component {
  constructor(props) {
    super(props)

    this.state = {
      period: 1,
      selectedPie: "pie-1",
      graphArr: []
    }

    this._choosPieItem = this._choosPieItem.bind(this)
    this._refreshData = this._refreshData.bind(this)
    this._changePeriod = this._changePeriod.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Графики расходов',
      headerStyle: mainStyle.headerStyle,
      headerTitleStyle: mainStyle.headerTitleStyle,
      /*headerRight: (
        <FontAwesome name='repeat' size={18} style={{color:'white', marginRight:20}} button onPress={navigation.getParam('refreshData')} />
      ),*/
      headerRight: <HeaderPicker />
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ refreshData: this._refreshData })
    this._refreshData()

    this.props.navigation.setParams({ showMenu: this.showMenu })
    this.props.navigation.setParams({ hideMenu: this.hideMenu })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.graph.Error.length > 0) {
      ToastTr.Danger(nextProps.graph.Error)
    } else {
      let arr = []

      nextProps.graph.GraphData.map((item, index) => {
        let newitem = {}
        newitem.Amount = item.Amount
        newitem.Caption = item.Caption
        newitem.Color = item.Color
        newitem.key = `pie-${index}`
        arr.push(newitem)
      })

      this.setState({graphArr: arr})
    }
  }

  setMenuRef = ref => this.setState({menuRef: ref});
  hideMenu = () => menuRef.hide();
  showMenu = () => menuRef.show();
 
  _changePeriod(value) {
    this.setState({ period: value })

    setTimeout(() => {
      this._refreshData()
      }, 200)
  }

  _choosPieItem(key) {
    this.setState({ selectedPie: key })
  }

  _refreshData() {
    this.props.getgraphicdata(this.props.user.UserId, this.state.period)
  }


  render() {
    const { user, graph } = this.props
    var pieGraphData = []
    var pieDescData = []

    if (this.state.graphArr.length > 0) {

      pieGraphData = this.state.graphArr
        .filter(item => item.Amount > 0)
        .map(item => ({
            value: item.Amount,
            description: item.Caption,
            svg: {
              fill: item.Color,
              onPress: () => this._choosPieItem(item.key),
              scale:0.85,
            },
            arc: (this.state.selectedPie == item.key) ? { outerRadius: '115%', cornerRadius: 10,  } : {},
            key: item.key,
        }))

      pieDescData = pieGraphData
    } else {
      pieGraphData = [].concat({
        value: 1,
        svg: {
          fill: '#B8B7B7',
          scale: 0.85,
        },
        key: 1,
      })

      pieDescData = [].concat({
        value: 0,
        description: "Информация отсутствует",
        svg: {
          fill: '#B8B7B7',
        },
        key: 1,
      })

    }



    return (
        <Container>
          
          <Segment style={{backgroundColor:'white'}}>
            <Picker
              mode="dropdown"
              placeholder="Выберите период"
              iosIcon={<Icon name="arrow-down"/>}
              itemStyle={{
                backgroundColor: '#d3d3d3',
                marginLeft: 0,
                paddingLeft: 10,
              }}
              style={{ width: undefined }}
              selectedValue={this.state.period}
              onValueChange={this._changePeriod}
            >
              <Picker.Item label="Текущий месяц" value={1} />
              <Picker.Item label="Весь период" value={2} />
            </Picker>
          </Segment>

          {(graph.isLoad)
          ? <Spinner />
          : <Content padder>
              <PieChart
                style={{height: 280}}
                innerRadius={1}
                data={pieGraphData}
                animate={true}
                animationDuration={500}
              />
              <Card style={{marginTop:10}}>
                <List dataArray={pieDescData}
                    renderRow={data => { 
                      return (
                        <ListItem icon button selected={this.state.selectedPie == data.key} onPress={() => this._choosPieItem(data.key)} style={{padding:0}}>
                          <Left>
                              <Svg width="13" height="13">
                                <Svg.Rect x="0" y="0" width="12" height="12" fill={data.svg.fill} />
                              </Svg>
                          </Left>
                          <Body>
                              <Text>{data.description}</Text>
                          </Body>
                          <Right>
                              <Text note>{data.value} {user.DefCurrency}</Text>
                          </Right>
                        </ListItem>
                      )}
                    }
                  />
              </Card>
            </Content>
          }
        </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.User,
    graph: state.Graph
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getgraphicdata: (UserId,type) => dispatch(GraphActions.Get(UserId,type))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graphics)