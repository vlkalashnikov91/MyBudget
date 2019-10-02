import React, {Component} from 'react'
import { connect } from 'react-redux'
import { StyleSheet, FlatList } from 'react-native'
import Svg, { Rect } from 'react-native-svg'
import { PieChart } from 'react-native-svg-charts'
import { Container, Body, Content, ListItem, Text, Card, Left, Right, CardItem, Segment, Icon, Title, Header, Button} from 'native-base'
import { SkypeIndicator } from 'react-native-indicators'
import moment from 'moment'
import { FontAwesome } from '@expo/vector-icons'
 
import { styles as main, ivanColor } from '../../Style'
import { SummMask } from '../../utils/utils'

import { GraphActions } from '../../actions/GraphActions'
import { ToastTr } from '../../components/Toast'
import PeriodPicker from '../../components/PeriodPicker'

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
          <Card style={main.mt_10} transparent>
            <FlatList
              data={arr}
              keyExtractor = {(item, index) => 'graph-'+item.description + index}
              renderItem={({item}) => {
                return (
                <ListItem icon button style={main.pd_0}>
                  <Left>
                    <Svg width="13" height="13">
                      <Rect x="0" y="0" width="12" height="12" fill={item.svg.fill} />
                    </Svg>
                  </Left>
                  <Body>
                    <Text style={(selectedPie === item.key)?{color:'#62B1F6'}:{}}>{item.description}</Text>
                  </Body>
                  <Right>
                    <Text note>{SummMask(item.value)} {user.DefCurrency}</Text>
                  </Right>
                </ListItem>
                )
              }}
            />
          </Card>
        </>
      } else {
        content = (
          <Card transparent>
            <CardItem style={main.fD_C}>
              <FontAwesome name='frown-o' size={70} style={styles.notFoundIcon}/>
                <Text note style={main.txtAl_c}>За выбранный вами период информация не найдена.</Text>
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
            <Right style={{flex:0.2}}>
              <Icon android='md-calendar' ios='ios-calendar' style={[main.clWhite, main.mr_15]} button onPress={this._showModalCalendar} />
            </Right>
          </Header>
          <Content padder>
            <Segment style={[main.bgWhite, {marginBottom:5}]}>
              <Text button bordered style={styles.monthHeader}>
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