import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux'

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase())

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    }

    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
  }

  //need to update
  onDismiss(id) {
    const isNotId = item => item.objectID !== id
    const updatedList = this.state.result.filter(isNotId)
    this.setState({ result: updatedList })
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value })
  }

  setSearchTopStories(result) {
    this.setState({ result })
  }

  componentDidMount() {
    const { searchTerm } = this.state

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error)
  }

  render() {
    console.log(this.state)
    const { searchTerm, result } = this.state

    if (!result) {
      return null;
    }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search
          </Search>
        </div>
        <Table
          list={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    )
  }
}

const Search = ({ value, onChange, children }) => 
  <form>
    {children} <input
      type="text"
      value={value}
      onChange={onChange}
    />
  </form>

class Table extends Component {
  render() {
    const { list, pattern, onDismiss } = this.props
    return (
      <div className="table">
        {list.filter(isSearched(pattern)).map(item => 
          <div key={item.objectID} className="table-row">
            <span>
              <a href = {item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        )}
      </div>
    )
  }
}

class Button extends Component {
  render() {
    const {
      onClick,
      className = '',
      children
    } = this.props

    return (
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
    )
  }
}

export default App;