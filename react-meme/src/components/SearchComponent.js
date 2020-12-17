
const React = require('react');
require('./SearchComponent.css');

class SearchComponent extends React.Component {



  render() {
    return (
      <div>
              <input type="text" id="searchText"></input>
        <button id="searchButton">Search</button>
      </div>
    )
  }
}




export default SearchComponent;
