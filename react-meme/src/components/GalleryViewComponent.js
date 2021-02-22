import upvote from '../pictures/upvote.png'
import downvote from '../pictures/downvote.png'
import share from '../pictures/share.png'
import download from '../pictures/download.png'
const React = require('react');
require('./GalleryViewComponent.css');

class GalleryViewComponent extends React.Component {

    state = {
    }

    render() {
        return (
            <div className="gallery_container">
            <button className="button">&lsaquo;</button>
            <div className= "g_container">
                <div className="left_container">
                    <div className= "g_user-date_container">
                        <p className="username">Username</p>
                        <p className="date">DATUM</p>
                    </div>
                    <div className= "g_above-image_container">
                        <h1 className="g_image-titel">TIIITELLLL</h1>
                        <div className="g_options-top_container">
                            <div className="g_share-download">
                                <button className="option-button"> <img src= {download} className="icon"/> </button>
                                <button className="option-button"> <img src= {share} className="icon"/> </button>
                            </div>
                        </div>
                    </div>
                    <div className="g_image_container">
                        <img src= "https://www.scinexx.de/wp-content/uploads/0/1/01-35131-nukliduhr01.jpg" className="image" />
                    </div>
                    <div className="g_points-commits">
                        <p className= "voting-point">Points:  </p>
                        <p className= "voting-point">Comments: </p>
                    </div>
                    <div className="g_option_container">
                        <button className="option-button"><img src= {upvote} className="icon" /></button>
                        <button className="option-button"><img src= {downvote} className="icon" /></button>
                    </div>    
                </div>    

                <div className="right_container">
                    <div className="g_comments">
                        <input className="input-text" placeholder="Leave a comment"/>
                        <button className="send">Send</button>
                        <div className="commets_container"></div>
                    </div>
                </div>
                
            </div>
            <button className="button">&rsaquo;</button>
            </div>
        );
    }
}
    
    
    
    
export default GalleryViewComponent;
