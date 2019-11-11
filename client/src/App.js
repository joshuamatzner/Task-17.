import React,{Component} from 'react';
import './App.css';
import {Modal, ModalHeader, ModalBody,ModalFooter,FormGroup,Input,Label,  Table, Button} from 'reactstrap';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      books: [],
      newItemModal: false,
      editItemModal: false,
      newProjectData: {
        title: '',
        description: '',
        URL: ''
      },  
        changeProjectData: {
        id: '',
        title: '',
        description: '',
        URL: ''
      },
    }
  }

deleteProject = (id) => {
  axios.delete('api/' + id).then((response) => {
  setTimeout(this.getProjectData(), 2000);

  alert("removing" + id)
  })
};

getProjectData = () => {
  axios.get('/api').then((response)=> {
    this.setState({
      books: response.data.content
    })
  });
}

  componentDidMount(){
    this.getProjectData();
  };

toggleNewProject = () => {
  this.setState({
     newItemModal: !this.state.newItemModal
    })
  }

  toggleChangedProjectModal = () => {
    this.setState({
      editItemModal: !this.state.editItemModal
    })
  }

  updateProject = () => {
    let {title, description, URL} = this.state.changeProjectData;
    axios.put('/api/'+ this.state.changeProjectData.id, {
      title,description, URL
    }).then((response) => {
      this.getProjectData();
      this.setState({
        editItemModal: false
      })
    console.log(response.data)
  setTimeout(this.getProjectData(), 2000);      
  })
}

  addProject = ()=> {
    axios.post('/api/add', this.state.newProjectData).then((response) => {
      let { books } = this.state;
      books.push(response.data);
            this.setState({
          books, 
          newItemModal: false,
          newProjectData: {
            title: '',
            description: '',
            URL: ''
        } 
    })
      console.log(response.data);
    })
    document.location.reload() 
  }

  changedItem = (id, title, description, URL) => {
    console.log(id)
    alert(id)
    axios.put(`api/${id}`, this.state.changeProjectData).then((response) => {
      console.log(response + "is the response")
      this.setState({
        changeProjectData: {id, title, description, URL},
        editItemModal: ! this.state.editItemModal
      })
      let books = [...this.state.books];
      let updatedList = []; 
      books.forEach(oldItem => {
        if(oldItem.id === id) {
            updatedList.push(this.state.changeProjectData)
        } else {
            updatedList.push(oldItem)
        }
    })
    books = updatedList;
    console.log(books)
  })
    console.log(title)
    this.getProjectData();
  }

  render() {
  console.log(this.state);
  let books = this.state.books.map((book) => {
    return(
      <tr key={book.id}>
        <td>{book.id}</td>
        <td>{book.title}</td>
        <td>{book.description} </td>
        <td>{book.URL}</td>
        <td>
          <Button color="success" size="sm" className="mr-3" onClick={this.changedItem.bind(this, book.id, book.title, book.description, book.URL)}>Edit</Button>
          <Button color="danger" size="sm" onClick={this.deleteProject.bind(this, book.id)}>Delete</Button>
        </td>
      </tr>
    )
  })

    return (
      <div className="App container">
        <h1>Express and React App</h1>
        <Button color="primary" className="my-4" onClick={this.toggleNewProject.bind(this)}>Add a new Item</Button>
        <Modal isOpen={this.state.newItemModal} toggle={this.toggleNewProject.bind(this)}>
          <ModalHeader toggle={this.toggleNewProject.bind(this)}>Modal title</ModalHeader>
          <ModalBody>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input id="title" value={this.state.changeProjectData.title} onChange={(e) => {
              let {changeProjectData} = this.state;
              changeProjectData.title = e.target.value
              this.setState({ changeProjectData})
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input id="description" value={this.state.changeProjectData.description} onChange={(e) => {
              let {changeProjectData} = this.state;
              changeProjectData.description = e.target.value
              this.setState({ changeProjectData})
            }} />
            <Label for="URL">URL</Label>
            <Input id="URL" value={this.state.changeProjectData.URL} onChange={(e) => {
              let {changeProjectData} = this.state;
              changeProjectData.URL = e.target.value
              // getting the newIteData URL and updating it
              this.setState({ changeProjectData})
            }}/>
          </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addProject.bind(this)}>Add Item</Button>{' '}
            <Button color="secondary" onClick={this.toggleNewProject.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.editItemModal} toggle={this.toggleChangedProjectModal.bind(this)}>
          <ModalHeader toggle={this.toggleChangedProjectModal.bind(this)}>title</ModalHeader>
          <ModalBody>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input id="title" value={this.state.changeProjectData.title} onChange={(e) => {
              let {changeProjectData} = this.state;
              changeProjectData.title = e.target.value
              this.setState({ changeProjectData})
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input id="description" value={this.state.changeProjectData.description} onChange={(e) => {
              let {changeProjectData} = this.state;
              changeProjectData.description = e.target.value
              this.setState({ changeProjectData})
            }} />
            <Label for="URL">URL</Label>
            <Input id="URL" value={this.state.changeProjectData.URL} onChange={(e) => {
              let {changeProjectData} = this.state;
              changeProjectData.URL = e.target.value
              // getting the newIteData URL and updating it
              this.setState({ changeProjectData})
            }}/>
          </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateProject.bind(this)}>Update Item</Button>{' '}
            <Button color="secondary" onClick={this.toggleChangedProjectModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books}
          </tbody>
        </Table>
      </div>
  );
  }
}

export default App;
