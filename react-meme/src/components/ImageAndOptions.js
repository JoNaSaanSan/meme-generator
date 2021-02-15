const React = require('react');
require('./ImageAndOptions.css');

class extends ImageAndOptions {
    state = {  }
    render() { 
        return (  
            <div>
                <img src= {this.props.url}/>
                <div className="options_container">
                    <button><img/></button>
                </div>
            </div>
        )
    }
}
 
export default ImageAndOptions;