import upvote from '../pictures/upvote.png'
import downvote from '../pictures/downvote.png'
import comments from '../pictures/comments.png'
import share from '../pictures/share.png'
import download from '../pictures/download.png'
import Store from '../redux/store';
const React = require('react');
require('./ImageOptionsText.css');


class ImageOptionsText extends React.Component {
    state = {
        accessToken: Store.getState().user.accessToken,
        isSignedIn: Store.getState().user.isSignedIn,
        upvotes: this.props.meme.upvotes,
        downvotes: this.props.meme.downvotes,
      }

    upvote(){
        console.log("upvote");

        var token = this.state.accessToken;
        var memeId = this.props.meme._id;
        const requestOptions = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
            },
          };
        fetch('http://localhost:3000/memes/upvote' + "?memeId="+ memeId, requestOptions)
        .then(response => {
            //return response.json();
            this.setState({upvotes: response.upvotes});
        })
    }

    downvote(){
        console.log("downvote");

    }

    numberOfComments(){
        if(this.props.meme.comments != undefined){
            return this.props.meme.comments.length
        }
        else{
            return 0
        }
    }

    commit(){
        console.log("make a commit")

        //var newD  = document.createElement('img');
        //document.querySelector('.commets_container').appendChild(newD);
        return(
            <div>Testen</div>
        )
    }


    render() {
        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn, accessToken: Store.getState().user.accessToken  })) 
        console.log("access: " + this.state.accessToken)
        return (
            <div className= "container">
                <div className= "user-date_container">
                    <p className="username">Username</p>
                    <p className="date">{this.props.meme.dateCreated}</p>
                </div>
                <div className= "above-image_container">
                    
                        <h1 className="image-titel">{this.props.meme.title}</h1>
                    
                    <div className="options-top_container">
                        <div className="share-download">
                            <button className="option-button"> <img src= {download} className="icon"/> </button>
                            <button className="option-button"> <img src= {share} className="icon"/> </button>
                        </div>
                    </div>
                </div>
                <div className="image_container">
                    <img src= {this.props.meme.base64} className="image" />
                </div>
                <div className="points-commits">
                    <p className= "voting-point">Points: {this.state.upvotes + this.state.downvotes} </p>
                    <p className= "voting-point">Comments: {this.numberOfComments()}</p>
                </div>
                <div className="option_container">
                    <button className="option-button"><img src= {upvote} className="icon" onClick={() => this.upvote()}/></button>
                    <button className="option-button"><img src= {downvote} className="icon" onClick={() => this.downvote()}/></button>
                    <button className="option-button"><img src= {comments} className="icon" onClick={() => this.commit()}/></button>
                </div>    
                    

                <div className="comments">
                    <input className="input-text" placeholder="Leave a comment"/>
                    <button className="send">Send</button>
                    <div className="commets_container"></div>
                </div>
                
                
            </div>
        );
    }
}
 
export default ImageOptionsText;