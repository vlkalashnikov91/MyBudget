import React, {Component} from 'react'
import { connect } from 'react-redux'
import { StyleSheet, FlatList } from 'react-native'
import { Svg } from 'expo'
import { PieChart } from 'react-native-svg-charts'
import { Container, Body, Content, Picker, ListItem, Text, Card, Left, Icon, Right, Segment, Button, View } from 'native-base'
import { SkypeIndicator } from 'react-native-indicators'
 
import { styles as main, ivanColor } from '../../Style'
import { SummMask } from '../../utils/utils'

import { GraphActions } from '../../actions/GraphActions'
import { ToastTr } from '../../components/Toast'

class Graphics extends Component {
  constructor(props) {
    super(props)

    this.timer = null

    this.state = {
      period: 1,
      graphArr: []
    }

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

  componentWillUnmount(){
    clearTimeout(this.timer)
  }

  choosePeriod(period) {
    if (period === 2) {
      this.props.navigation.navigate('Filter')
    }
    this.setState({period: period})
  }

  render() {
    const { user, graph } = this.props
    const { graphArr, period } = this.state
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
              scale:0.85,
            },
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
          <Content padder>
            {(graph.isLoad)
            ? <SkypeIndicator color={ivanColor} />
            : <>
                <View style={[main.mt_10, main.fD_R, {justifyContent:'space-evenly', borderColor:ivanColor, borderRadius:5}]}>
                  <Button small onPress={_=> this.choosePeriod(1)} bordered={!(period===1)} style={(period===1)? main.bgIvan: {borderColor:ivanColor}}>
                    <Text uppercase={false} style={(period===1)?main.clWhite:main.clIvan}>Текущий месяц</Text>
                  </Button>
                  <Button small onPress={_=> this.choosePeriod(2)} bordered={!(period===2)} style={(period===2)? main.bgIvan : {borderColor:ivanColor}}>
                    <Text uppercase={false} style={(period===2)? main.clWhite : main.clIvan}>Выбрать период</Text>
                  </Button>
                </View>

                <PieChart
                  style={{height: 280}}
                  innerRadius={1}
                  data={pieGraphData}
                  animate={true}
                  animationDuration={500}
                />
                <Card style={main.mt_10} transparent>
                  <FlatList
                    data={pieDescData}
                    keyExtractor = {(item, index) => 'graph-'+item.description + index}
                    renderItem={({item}) => {
                      <ListItem icon button style={main.pd_0}>
                        <Left>
                          <Svg width="13" height="13">
                            <Svg.Rect x="0" y="0" width="12" height="12" fill={item.svg.fill} />
                          </Svg>
                        </Left>
                        <Body>
                          <Text style={[main.clGrey, main.fontFam]}>{item.description}</Text>
                        </Body>
                        <Right>
                          <Text note style={main.fontFam}>{SummMask(item.value)} {user.DefCurrency}</Text>
                        </Right>
                      </ListItem>
                    }}
                  />
                </Card>
              </>}
            </Content>
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