// The recharts library provides several types of diagrams which can be filled with data
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
const React = require('react');


// Handles the visual graphs using the recharts library
class StatisticsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    this.setState({
      data: [
        { category: 'upvotes', popularity: 0 },
        { category: 'downvotes', popularity: 0 },
        { category: 'comments', popularity: 0 },
      ]
    })
  }
  
  componentDidUpdate(prevProps, prevState) {
    console.log(this.props.currentMeme)
    // Fills in the statistics from Meme data
    if (this.props.currentMeme !== prevProps.currentMeme) {
      try {
        if (this.props.currentMeme !== undefined) {
          var comments = this.props.comments || 0
          var upvotes = this.props.currentMeme.upvotes || 0
          var downvotes = this.props.currentMeme.downvotes || 0
          this.setState({
            data: [
              { category: 'upvotes', popularity: upvotes },
              { category: 'downvotes', popularity: downvotes },
              { category: 'comments', popularity:  comments},
            ]
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  render() {
    return (
      <div className="graph-view">
        <BarChart width={320} height={200} data={this.state.data} className="chart">
          <XAxis dataKey="category" stroke='#ffffff' fontSize="12px" allowDataOverflow={"true"} />
          <YAxis dataKey="popularity" stroke='#ffffff' />
          <Bar dataKey="popularity" fill='#ffffff' />
        </BarChart>
      </div>
    )
  }
}

export default StatisticsComponent;