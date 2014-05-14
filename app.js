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

var FOLDERS = ['main', 'archive', 'trash'];

function capitalize(str) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.substr(1);
}

var FolderList = React.createClass({
  render: function() {
    var activeFolder = this.props.folder;
    return React.DOM.ul({className: 'folder-list'},
      FOLDERS.map(function(folder) {
        var classes = folder === activeFolder ? 'active-folder' : '';
        return React.DOM.li({className: classes, key: folder},
          React.DOM.a({href: '#/' + folder}, capitalize(folder)));
      }));
  }
});

var Note = React.createClass({
  changeNote: function(key, value) {
    var id = this.props.id;
    _.defer(function() {
      dispatch({
        action: 'noteChange',
        id: id,
        key: key,
        value: value
      });
    });
  },

  saveText: _.debounce(function(newText) {
    this.changeNote('text', newText);
  }, 500),

  handleChange: function(event) {
    this.saveText(event.target.value);
  },

  setFolderTo: function(folder) {
    var oldFolder = this.props.folder;
    this.changeNote('folder', folder);
    _.defer(function() {
      // FIXME: should go through dispatcher
      router.setRoute(oldFolder);
    });
  },

  handleTrash: function() {
    this.setFolderTo('trash');
  },

  handleArchive: function() {
    this.setFolderTo('archive');
  },

  render: function() {
    return React.DOM.div({className: 'note'},
      React.DOM.div({className: 'controls'},
        React.DOM.button({className: 'pure-button archive-button',
                          onClick: this.handleArchive},
                         'Archive'),
        React.DOM.button({className: 'pure-button trash-button',
                          onClick: this.handleTrash},
                         'Trash')),
      React.DOM.p({className: 'note-header-text'},
                   'Noted ', this.props.created),
      React.DOM.form({className: 'pure-form'},
        React.DOM.textarea({
          className: 'note-edit pure-input-1',
          defaultValue: this.props.text,
          onChange: this.handleChange
        })));
  }
});

var SearchBox = React.createClass({
  handleChange: function(event) {
    this.props.onTextChange(event.target.value);
  },
  render: function() {
    return React.DOM.form({className: 'pure-form'},
      React.DOM.input({
        className: 'search-box',
        defaultValue: this.props.searchText,
        onChange: this.handleChange
      }));
  }
});

var NoteSummary = React.createClass({
  handleClick: function() {
    // FIXME: to be Flux-y, this should go through a dispatcher to prevent
    // possible infinite loops, if I've understood Flux correctly.
    router.setRoute('note/' + this.props.id);
  },
  render: function() {
    return React.DOM.p({className: 'note-summary', onClick: this.handleClick},
      this.props.text);
  }
});

var NoteSummaryList = React.createClass({
  render: function() {
    var folder = this.props.folder;
    return React.DOM.div({className: 'note-summary-list'},
      this.props.notes.map(function(note) {
        return NoteSummary(_.extend({key: note.id}, note));
      }));
  }
});

var FilterableNoteList = React.createClass({
  getInitialState: function() {
    return {searchText: ''};
  },
  setSearchText: function(newText) {
    this.setState({searchText: newText.trim().toLowerCase()});
  },
  render: function() {
    var searchText = this.state.searchText;
    var folder = this.props.folder;
    var filteredNotes = this.props.notes.filter(function(note) {
      return (note.folder === folder &&
              (!searchText ||
               note.text.toLowerCase().indexOf(searchText) !== -1));
    });

    return React.DOM.div({className: 'filterable-note-list'},
      React.DOM.div({className: 'controls'},
        React.DOM.button({className: 'pure-button new-note-button'},
                        'New Note'),
        SearchBox({
          searchText: this.state.searchText,
          onTextChange: this.setSearchText
        })),
      NoteSummaryList({notes: filteredNotes}));
  }
});

var ContentPane = React.createClass({
  render: function() {
    return React.DOM.div({className: 'content-pane'},
      this.props.viewType === 'list' ?
        FilterableNoteList(_.pick(this.props, 'notes', 'folder',
                                              'searchText')) :
        Note(_.where(this.props.notes, {id: this.props.noteId})[0]));
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      notes: EXAMPLE_NOTES,
      viewType: 'list', // or 'note'
      folder: 'main', // only used if viewType 'list'
      noteId: '4' // only used if viewType 'note'
    };
  },

  setNote: function(id, key, value) {
    var notes = _.clone(this.state.notes);
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].id === id) {
        notes[i] = _.clone(notes[i]);
        notes[i][key] = value;
      }
    }
    this.setState({notes: notes});
  },

  render: function() {
    return React.DOM.div(null,
      React.DOM.div({className: 'pure-u-1-5'},
        FolderList(this.state.viewType === 'list' ?
                   {folder: this.state.folder}
                   : null)),
      React.DOM.div({className: 'pure-u-4-5'},
        ContentPane(_.pick(this.state, 'notes', 'viewType', 'folder',
                                       'noteId'))));
  }
});

var reactEl = document.getElementById('react-container');
var mountedApp = React.renderComponent(App(), reactEl);

function dispatch(uiEvent) {
  if (uiEvent.action === 'noteChange') {
    mountedApp.setNote(uiEvent.id, uiEvent.key, uiEvent.value);
  }
}

var router = Router({
  '/(main|archive|trash|)': function(folder) {
    mountedApp.setState({viewType: 'list', folder: folder || 'main'});
  },
  '/note/:id': function(id) {
    mountedApp.setState({viewType: 'note', noteId: id});
  }
});

router.init();
