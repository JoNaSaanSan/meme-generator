const React = require('react');
require('./Comments.css');

class Comments extends React.Component {

    constructor(props) {
        super(props);
        // Init state
        this.state = {
            date: this.props.date,
            text: this.props.text,
        }
    }

    render() {
        return (
            <div className="comment_container">
                <div className="comment_date">{this.state.date}</div>
                <div className="comment_text">{this.state.text}</div>
            </div>
        )
    }
}
export default Comments;