import React, {Component} from 'react'
import { Platform } from 'react-native'
import { connect } from 'react-redux'
import { StyleSheet, PixelRatio } from 'react-native'
import Svg, { Rect, Circle } from 'react-native-svg'
import { PieChart } from 'react-native-svg-charts'
import { Container, Body, Content, ListItem, Text, Card, Left, Right, CardItem, Segment, Icon, Title, Header, Button, View} from 'native-base'
import { SkypeIndicator } from 'react-native-indicators'
import { FlatList, RectButton } from 'react-native-gesture-handler'
import moment from 'moment'
import { FontAwesome, AntDesign } from '@expo/vector-icons'
 
import { styles as main, ivanColor } from '../../Style'
import { SummMask } from '../../utils/utils'

import { GraphActions } from '../../actions/GraphActions'
import { ToastTr } from '../../components/Toast'
import PeriodPicker from '../../components/PeriodPicker'
import SwipeableRow from '../../components/SwipeableRow'


class Graphics extends Component {
  constructor(props) {
    super(props)

    this.timer = null

    let date = new Date()

    this.state = {
      graphArr: [],
      selectedPie: '-1',
      dateTo: date,
      dateFrom: new Date(date.getFullYear(), date.getMonth(), 1),
    }

    this._showModalCalendar = this._showModalCalendar.bind(this)

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.graph.Error.length > 0) {
      ToastTr.Danger(nextProps.graph.Error)
    } else {
      let arr = []

      nextProps.graph.GraphData.filter(item => item.Amount > 0)
      .map((item, index) => {
        let newitem = {}
        newitem.Amount = item.Amount
        newitem.Caption = item.Caption
        newitem.Color = item.Color
        newitem.key = `pie-${index}`
        newitem.svg = { fill: item.Color, scale:0.85, onPress: () => this._choosPieItem(`pie-${index}`) },
        arr.push(newitem)
      })

      this.setState({graphArr: arr})
    }
  }

  componentDidMount(){
    this.props.getgraphicdata(this.props.user.UserId, moment(this.state.dateFrom).format('DD-MM-YYYY'), moment(this.state.dateTo).format('DD-MM-YYYY'))
  }

  componentWillUnmount(){
    clearTimeout(this.timer)
  }

  _showModalCalendar() {
    let { dateFrom, dateTo } = this.state

    this.picker
      .show({dateTo, dateFrom})
      .then(({dateTo, dateFrom}) => {

        this.setState({ dateFrom, dateTo })
        this.props.getgraphicdata(this.props.user.UserId, moment(dateFrom).format('DD-MM-YYYY'), moment(dateTo).format('DD-MM-YYYY'))
      })
  }

  _choosPieItem(key) {
    this.setState({ selectedPie: key })
  }


  renderItem = ({ item }) => {
    let { user } = this.props
    let { selectedPie } = this.state
    return (
      <View style={styles.row}>
        <RectButton style={main.fl_1} onPress={_=> this._choosPieItem(item.key)}>
          <View style={styles.rectView}>
            <Body style={[main.fl_1, main.fD_R]}>
              <View style={[styles.rectDot,{backgroundColor:item.svg.fill}]}></View>
              <Text style={(selectedPie === item.key)?{color:'#62B1F6'}:{}}>{item.description}</Text>
            </Body>
            <Right>
              <Text style={(selectedPie === item.key)?{color:'#62B1F6'}:{}}>{item.value} {user.DefCurrency}</Text>
            </Right>
          </View>
        </RectButton>
      </View>
    )
  }

  render() {
    const { user, graph } = this.props
    const { dateTo, dateFrom, selectedPie, graphArr } = this.state
    let content = <SkypeIndicator color={ivanColor} />

    if (!graph.isLoad) {
      if (graphArr.length > 0) {

        let arr = graphArr.map(item => ({
            value: item.Amount,
            description: item.Caption,
            svg: item.svg,
            arc: (selectedPie === item.key) ? { outerRadius: '115%', cornerRadius: 10,  } : {},
            key: item.key,
          }))

        content = <>
          <PieChart
            style={{height: 280}}
            innerRadius={1}
            data={arr}
            animate={true}
            animationDuration={500}
          />
          <FlatList data={arr}
            keyExtractor = {(item, index) => 'graph-'+item.description + index}
            renderItem={this.renderItem}
          />
        </>
      } else {
        content = (
          <Card transparent>
            <CardItem style={main.fD_C}>
              <FontAwesome name='frown-o' size={70} style={styles.notFoundIcon}/>
                <Text note style={main.txtAl_c}>За выбранный Вами период информация не найдена.</Text>
            </CardItem>
          </Card>
        )
      }
    }

    return (
        <Container>
          <Header>
            <Body>
              <Title style={main.ml_10}>Расходы по категориям</Title>
            </Body>
            <Right style={{flex:0.3}}>
              <Button transparent hitSlop={{top:10, left:10, bottom:10, right:10}} icon onPress={this._showModalCalendar}>
                <AntDesign name='calendar' style={main.clWhite} size={20}/>
              </Button>
            </Right>
          </Header>
          <Content padder>
            <Segment style={[main.bgWhite, {marginBottom:5}]}>
              <Text button bordered style={styles.monthHeader} onPress={this._showModalCalendar}>
                <Text>{moment(dateFrom).format("DD MMM YYYY")} - {moment(dateTo).format("DD MMM YYYY")}</Text>
              </Text>
            </Segment>
          
            {content}
          
          </Content>

          <PeriodPicker ref={(picker) => this.picker=picker} />

        </Container>
    )
  }
}


const styles = StyleSheet.create({
  row: {
    height: 50,
    marginHorizontal: 8,
    ...main.fD_R,
    ...main.aI_C, 
    ...main.fl_1
  },
  rectView: {
    ...main.fl_1,
    ...main.fD_R,
    ...main.aI_C,
    paddingLeft: 8,
    paddingRight:8,
    borderColor:'#c9c9c9', 
    borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1)
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height:'100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalWindow: {
    ...main.bgWhite,
    marginHorizontal: 5,
    marginBottom: 5,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  monthHeader: {
    marginTop: 5,
    fontSize: 18
  },
  monthDates: {
    ...main.clIvan,
    ...main.fontFamBold
  },
  notFoundIcon: {
    color:'#609AD3', 
    marginBottom:20, 
    opacity:0.8
  },
  rectDot: {
    width:13, 
    height:13, 
    marginRight:8
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
    getgraphicdata: (UserId, from, to) => dispatch(GraphActions.Get(UserId, from, to))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graphics)