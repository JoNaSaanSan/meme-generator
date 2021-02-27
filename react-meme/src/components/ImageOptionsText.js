import upvote from '../pictures/upvote.png'
import downvote from '../pictures/downvote.png'
import comments from '../pictures/comments.png'
import share from '../pictures/share.png'
import download from '../pictures/download.png'
import Store from '../redux/store';
import { Link } from 'react-router-dom'
import { b64toBlob } from '../utils/ImageUtils';
const React = require('react');
require('./ImageOptionsText.css');


class ImageOptionsText extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accessToken: Store.getState().user.accessToken,
            isSignedIn: Store.getState().user.isSignedIn,
            upvotes: this.props.meme.upvotes,
            //downvotes: null,
            downvotes: this.props.meme.downvotes,
            currentMeme: null,
            base64: this.props.meme.base64,
            formatType: this.props.meme.memeTemplate.formatType,
            index: this.props.index,
            memesArray: this.props.memesArray, //memesArray from Browse (filter option hot/fresh) to show in Gallery
        };
    }

  
        
    
    componentDidUpdate(prevProps){
        /*
        //console.log("upvotes "+ this.state.upvotes)
        if(this.props.meme.upvotes !== prevProps.meme.upvotes || this.props.meme.base64 !== prevProps.meme.base64 || this.props.meme.memeTemplate.formatType !== prevProps.meme.memeTemplate.formatType)
        this.setState({
            upvotes: this.props.meme.upvotes,
            downvotes: this.props.meme.downvotes,
            base64: this.props.meme.base64,
            formatType: this.props.meme.memeTemplate.formatType,
        })*/
        
        console.log("upvotes state: "+ this.state.upvotes)
        //wenn z.B. in Browse andere filteroption gewählt wird
        if(this.props.meme !== prevProps.meme){
            this.setState({
                currentMeme: this.props.meme,
                base64: this.props.meme.base64,
                formatType: this.props.meme.memeTemplate.formatType,
                upvotes: this.props.meme.upvotes,
                downvotes: this.props.meme.downvotes,
            })
        }

        if(this.props.memesArray !== prevProps.memesArray){
            this.setState({
                memesArray: this.props.memesArray
            })
        }
        console.log("upvotes profile" + this.props.meme.upvotes)
    }


    upvote() {
        console.log("upvote");

        var token = this.state.accessToken;
        console.log("my token" + token)
        var memeId = this.props.meme._id;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        };
        fetch('http://localhost:3000/memes/upvote' + "?memeId=" + memeId, requestOptions)
            .then(async response => {
                const data = await response.json()
                console.log("upvotes data"+ JSON.stringify(data))
                //return response.json();
                this.setState({ upvotes: data.upvotes});
            })

    }

    downvote() {
        console.log("downvote");
        var token = this.state.accessToken;
        console.log("my token" + token)
        var memeId = this.props.meme._id;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        };
        fetch('http://localhost:3000/memes/downvote' + "?memeId=" + memeId, requestOptions)
            .then(async response => {
                const data = await response.json()
                //return response.json();
                this.setState({ downvotes: data.downvotes });
            })

    }

    numberOfComments() {
        if (this.props.meme.comments != undefined) {
            return this.props.meme.comments.length
        }
        else {
            return 0
        }
    }


    selectFormat(){
        if(this.state.formatType === "video"){
            
            var base64result = this.state.base64.split(',');
            var base64blob = URL.createObjectURL(b64toBlob(base64result[1], base64result[0]))            
            return(
                <video src={base64blob} className="image" autoplay= "true" loop= "true"/>
            )
        }
        else{
            return(
                <img src={this.state.base64} className="image"/>
            )
        }
    }


    render() {
        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn, accessToken: Store.getState().user.accessToken }))
        console.log("access: " + this.state.accessToken)
        return (
            <div className="container">
                <div className="user-date_container">
                    <p className="username">Username</p>
                    <p className="date">{this.props.meme.dateCreated}</p>
                </div>
                <div className="above-image_container">

                    <h1 className="image-titel">{this.props.meme.title}</h1>

                    <div className="options-top_container">
                        <div className="share-download">
                            <button className="option-button"> <img src={download} className="icon" /> </button>
                            <button className="option-button"> <img src={share} className="icon" /> </button>
                        </div>
                    </div>
                </div>
                <div className="image_container">
                <Link to={{pathname: "/gallery", index: this.state.index, memesArray: this.state.memesArray}}>{this.selectFormat()}</Link>
                </div>
                <div className="points-commits">
                    <p className="voting-point">Points: {this.state.upvotes} </p>
                    <p className="voting-point">Comments: {this.numberOfComments()}</p>
                </div>
                <div className="option_container">
                    <button className="option-button"><img src={upvote} className="icon" onClick={() => this.upvote()} /></button>
                    <button className="option-button"><img src={downvote} className="icon" onClick={() => this.downvote()} /></button>
                    <Link to={{pathname: "/gallery", index: this.state.index, memesArray: this.state.memesArray}}><button className="option-button"><img src={comments} className="icon" /></button></Link>
                </div>

                <div>{this.state.formatType}</div>


            </div>
        );
    }
}

export default ImageOptionsText;