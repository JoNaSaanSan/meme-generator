import upvote from '../../pictures/upvote.png'
import downvote from '../../pictures/downvote.png'
const React = require('react');
require('./ImageAndOptions.css');

class ImageAndOptions extends React.Component {
    state = {  }
    
    render() { 
        return (  
            <div>
                <div className= "voting-points">Points:</div>
                <div className="options_container">
                    <button className="voting-button"><img src= {upvote} className="icon"/></button>
                    <button className="voting-button"><img src= {downvote} className="icon"/></button>
                </div>
            </div>
        )
    }
}
 
export default ImageAndOptions;
