import React from 'react';
import ReactTags from 'react-tag-autocomplete';
import './QuestionTag.css';

class QuestionTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      suggestions: [],
    };
  }
  componentDidMount() {
    fetch('data/tags.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(
        (myJson) => {
          this.setState({
            isLoaded: true,
            suggestions: myJson,
          });
        },
        (error) => {
          this.setState({
            error,
            isLoaded: true,
            suggestions: [],
          });
        }
      )
  }
  handleDelete(i) {
    const tags = this.props.tags.slice(0);
    tags.splice(i, 1);
    this.props.setTags(tags);
  }

  handleAddition(tag) {
    const tags = [].concat(this.props.tags, tag);
    this.props.setTags(tags);
  }

  render() {
    const { error, isLoaded, suggestions } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ReactTags
          tags={this.props.tags}
          suggestions={suggestions}
          onDelete={this.handleDelete.bind(this)}
          onAddition={this.handleAddition.bind(this)}
        />
      );
    }
  }
}

export default QuestionTag;
