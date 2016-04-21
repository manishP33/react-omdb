// Bring in React and ReactDom
var React = require('react');
var ReactDOM = require("react-dom");
var PropTypes = React.PropTypes;
var styles = require("./styles/index");

function queryOmdb (query) {
  var term = query.replace(/\s/, "+"); // replace any white space characters with a "+"
  var url = "http://omdbapi.com/?s=" + term;

  // fetch all movies matching the passed in title as JSON
  return $.getJSON(url).then(function(response) {
    return response["Search"]
  });
}

var SearchContainer = React.createClass({
  // define our Search component's state when its rendered
  getInitialState: function () {
    return {
      query: "", // search query starts empty
      searched: false, // a user has not submitted a search by defualt
      results: [] // initialize an empty array for results
    }
  },
  // when ever search input is entered, change the state
  handleUpdateSearch: function (e) {
    this.setState({
      query: e.target.value // grab whatever's in the search input
    });
  },
  // when the user clicks search
  handleSubmitSearch: function (e) {
    var component = this; // cache reference to component's context
    e.preventDefault(); // prevent default page refresh
    console.log(this.state.query); // log the current value of the user's search
    // make ajax call
    queryOmdb(this.state.query).then(function(movies) {
      console.log(movies);
      // redefine our app's state to include populated response
      component.setState({
        results: movies,
        query: "",
        searched: true // flip the switch
      })
    })
  },
  render: function () {
    if (this.state.searched) {
      return (
        <Results movies={this.state.results} />
      )
    }
    return (
      <Search
        onUpdateSearch={this.handleUpdateSearch}
        onSubmitSearch={this.handleSubmitSearch}
        query={this.state.query}
       />
    )
  }
});

var Search = React.createClass({
  render: function () {
    return (
      <div className="jumbotron col-sm-6 col-sm-offset-3 text-center" style={styles.transparentBg}>
        <div className="col-sm-12">
          <form onSubmit={this.props.onSubmitSearch}>
            <div className="form-group">
              <input
                className="form-control"
                onChange={this.props.onUpdateSearch}
                type="text"
                value={this.props.query}
                placeholder="Enter a Movie Title..." />
            </div>
            <div className="form-group col-sm-4 col-sm-offset-4">
              <button
                className="btn btn-block btn-primary"
                type="submit">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
});

Search.propTypes = {
  onUpdateSearch: PropTypes.func.isRequired,
  onSubmitSearch: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired
}

var Results = React.createClass({
  render: function () {
    return (
      <div style={styles.movies}>
        {this.props.movies.map(function(movie, index) {
          return (
            <div style={styles.movie} key={index}>
              <img
                className="img-thumbnail"
                src={movie.Poster}
                style={styles.posterThumb} />
              <p style={styles.textOverflow}>{movie.Title}</p>
            </div>
          )
        })}
      </div>
    )
  }
});

var Home = React.createClass({
  render: function () {
    return (
      <div className="jumbotron col-sm-12 text-center" style={styles.transparentBg}>
        <h1><a href="/">React OMDB</a></h1>
        <div className="col-sm-12" style={styles.space}>
          <SearchContainer />
        </div>
      </div>
    )
  }
});

// Render Home
ReactDOM.render(
  <Home />, // our component
  document.getElementById("app") // where to render
)