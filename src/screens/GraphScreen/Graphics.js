import React, {Component} from 'react'
import { connect } from 'react-redux'
import { StyleSheet, Image } from 'react-native'
import { Svg } from 'expo'
import { PieChart } from 'react-native-svg-charts'
import { Container, Body, Content, Picker, ListItem, Text, List, Card, Left, Icon, Right, Spinner, Segment } from 'native-base'
import FontAwesome from '@expo/vector-icons/FontAwesome'
 
import { styles as main } from '../../Style'
import { SummMask } from '../../utils/utils'

import { GraphActions } from '../../actions/GraphActions'
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
      headerRight: (
        <FontAwesome name='repeat' size={18} style={[main.clWhite, main.mr_20]} button onPress={navigation.getParam('refreshData')} />
      )
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
    const { graphArr, selectedPie} = this.state
    var pieGraphData = []
    var pieDescData = []

    if (graphArr.length > 0) {

      pieGraphData = graphArr
        .filter(item => item.Amount > 0)
        .map(item => ({
            value: item.Amount,
            description: item.Caption,
            svg: {
              fill: item.Color,
              onPress: () => this._choosPieItem(item.key),
              scale:0.85,
            },
            arc: (selectedPie === item.key) ? { outerRadius: '115%', cornerRadius: 10,  } : {},
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
          <Segment style={main.bgWhite}>
            <Picker
              mode="dropdown"
              placeholder="Выберите период"
              iosIcon={<Icon name="arrow-down"/>}
              itemStyle={styles.PickerItem}
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
              <Card style={main.mt_10}>
                <List dataArray={pieDescData}
                    renderRow={data => { 
                      return (
                        <ListItem icon button
                          //selected={(this.state.selectedPie === data.key)}
                          onPress={_ => this._choosPieItem(data.key)}
                          style={main.pd_0}
                        >
                          <Left>
                              <Svg width="13" height="13">
                                <Svg.Rect x="0" y="0" width="12" height="12" fill={data.svg.fill} />
                              </Svg>
                          </Left>
                          <Body>
                              <Text style={[main.clGrey, main.fontFam, (selectedPie === data.key) && {color:'#62B1F6'}]}>{data.description}</Text>
                          </Body>
                          <Right>
                              <Text note style={main.fontFam}>{SummMask(data.value)} {user.DefCurrency}</Text>
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

const styles = StyleSheet.create({
  PickerItem: {
    ...main.bgGray,
    ...main.ml_0,
    ...main.pdL_10
  }
})

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