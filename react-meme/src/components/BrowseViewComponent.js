import ImageOptionsText from './ImageOptionsText';
import InfiniteScroll from "react-infinite-scroll-component";
const React = require('react');
require('./BrowseViewComponent.css');

class BrowseViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allMemes: [],
      popularMemes: [],
      items: Array.from({ length: 1 }),
      hasMoreToLoad: true
    }
  }


  fetchMoreData = () => {
    // a fake async api call like which sends
    // 3 more records in 0.05 
    if( this.state.items.length < this.state.allMemes.length-1){
      
        setTimeout(() => {
          this.setState({
            items: this.state.items.concat(Array.from({ length: 2 }))
          });
        }, 50);
    }else{
      this.setState({hasMoreToLoad: false})
    }
  };


  componentDidMount() {
    this.getAllMemes(); 
    this.getPupularMemes();
  }

  createMemes(){
    if(this.state.allMemes.length > 0){
      console.log("test1")
        
        return(
          this.state.items.map((i, index) => (
          <div  key={index}>
            <div><ImageOptionsText meme={this.state.allMemes[index]} index = {index}/></div>
          </div>
        )))
          
     
    }
      

  }

  /**
   * Memes Array sorted by time of creation
   */
  getAllMemes(){
    fetch('http://localhost:3000/memes/browsememes').then(response => {
      return response.json();
    })
    .then(data => {
      //console.log("data: " + JSON.stringify(data))
      this.setState({allMemes: data})//, () => this.createMemes(this.state.allMemes))
    }).catch(error => {
      console.log(error);
    });
  }

  /**
   * Memes Array sorted by number of upvotes
   */
  getPupularMemes(){
    fetch('http://localhost:3000/memes/popularmemes').then(response => {
      return response.json();
    })
    .then(data => {
      //console.log("data popularmemes: " + JSON.stringify(data))
      this.setState({popularMemes: data})//, () => this.createMemes(this.state.popularMemes))
    }).catch(error => {
      console.log(error);
    });
  }




  render() {
    return (

      <div className="imageOptions_container">
        <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.fetchMoreData}
          hasMore={this.state.hasMoreToLoad}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center', marginBottom: '50px' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }>
          {this.createMemes()}

        </InfiniteScroll>

      </div>
    );
  }
}




export default BrowseViewComponent;
