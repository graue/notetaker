var EXAMPLE_NOTES = [
  {
    "id": "5",
    "folder": "main",
    "created": "2014-05-12T18:20:31.064Z",
    "modified": "2014-05-12T18:22:28.013Z",
    "text": "5/8/14\n  * $7 roti\n  * $3 apple\n  * $4 coffee\n  * more things I bought\n\nThe note goes on and can be edited here. It is saved \"immediately\" following a change, but really after a short delay. Blah blah blah blah blah."
  },
  {
    "id": "4",
    "folder": "main",
    "created": "2014-05-12T16:00:29.517Z",
    "modified": "2014-05-12T16:00:56.017Z",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, veniam illus mon faugratrois und verklempt fisch and you thought it was but then it wasn't, gone to seediately, THE END. ...OR IS IT?"
  },
  {
    "id": "3",
    "folder": "main",
    "created": "2014-05-12T10:26:33.813Z",
    "modified": "2014-05-12T10:56:33.813Z",
    "text": "Wow I can't believe I'm up so early in the morning. WTF"
  },
  {
    "id": "1",
    "folder": "archive",
    "created": "2013-02-10T21:16:50.563Z",
    "modified": "2013-02-10T21:39:11.311Z",
    "text": "First day of Hacker School! w00t!!!"
  }
];

var EXAMPLE_STATE = {
  notes: EXAMPLE_NOTES,
  viewType: 'list', // or 'note'
  folder: 'main', // only used if viewType 'list'
  searchText: '', // only used if viewType 'list'
  note: '4' // only used if viewType 'note'
};

var FolderList = React.createClass({
  render: function() {
    return React.DOM.div({className: 'folder-list'},
      'This will be the folder list');
  }
});

var Note = React.createClass({
  render: function() {
    // TODO
    return React.DOM.div({className: 'note'}, 'Note goes here');
  }
});

var SearchBox = React.createClass({
  render: function() {
    // TODO
    return React.DOM.form({className: 'pure-form'},
      React.DOM.input({className: 'search-box'}));
  }
});

var NoteSummary = React.createClass({
  render: function() {
    return React.DOM.p({className: 'note-summary'},
      this.props.text);
  }
});

var NoteSummaryList = React.createClass({
  render: function() {
    var folder = this.props.folder;
    return React.DOM.div({className: 'note-summary-list'},
      this.props.notes.filter(function(note) {
        return note.folder === folder;
      }).map(function(note) {
        return NoteSummary(note);
      }));
  }
});

var FilterableNoteList = React.createClass({
  render: function() {
    return React.DOM.div({className: 'filterable-note-list'},
      React.DOM.button({className: 'pure-button new-note-button'},
                       'New Note'),
      SearchBox(_.pick(this.props, 'searchText')),
      NoteSummaryList(_.pick(this.props, 'notes', 'folder', 'searchText')));
  }
});

var ContentPane = React.createClass({
  render: function() {
    return React.DOM.div({className: 'content-pane'},
      this.props.viewType === 'list' ?
        FilterableNoteList(_.pick(this.props, 'notes', 'folder',
                                              'searchText')) :
        Note(_.pick(this.props, 'note')));
  }
});

var App = React.createClass({
  render: function() {
    return React.DOM.div(null,
      React.DOM.div({className: 'pure-u-1-5'},
        FolderList(_.pick(this.props, 'viewType', 'folder'))),
      React.DOM.div({className: 'pure-u-4-5'},
        ContentPane(_.pick(this.props, 'notes', 'viewType', 'folder',
                                       'searchText', 'note'))));
  }
});

var reactEl = document.getElementById('react-container');
React.renderComponent(App(EXAMPLE_STATE), reactEl);
