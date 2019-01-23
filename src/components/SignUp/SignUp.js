import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import userRequests from '../../helpers/data/userRequests';
import './SignUp.scss';
import authRequests from '../../helpers/data/authRequests';

const defaultUser = {
  email: '',
  username: '',
  password: '',
  characterTokens: 4,
  levelUpTokens: 2,
  uid: '',
};


class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: defaultUser,
      modal: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }


  saveUser = () => {
    const { newUser } = this.state;
    authRequests.createUser(newUser.email, newUser.password).then((data) => {
      const userWithUid = { ...this.state.newUser };
      userWithUid.uid = data.user.uid;
      userRequests.addUser(userWithUid).then(() => {
        this.setState({ newUser: defaultUser });
      })
        .catch(error => console.error('error on addUser', error));
    }).catch(error => console.error('error on saveUser', error));
  }

  formFieldStringState = (name, e) => {
    e.preventDefault();
    const tempUser = { ...this.state.newUser };
    tempUser[name] = e.target.value;
    this.setState({ newUser: tempUser });
  }

  emailChange = e => this.formFieldStringState('email', e);

  usernameChange = e => this.formFieldStringState('username', e);

  passwordChange = e => this.formFieldStringState('password', e);

  render() {
    const { newUser } = this.state;
    return (
      <div className="Auth">
      <p>Don't have an account? <Button className='btn btn-dark' onClick={this.toggle}>Sign Up</Button></p>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Sign Up to Play!</ModalHeader>
          <ModalBody>
          <Form>
        <FormGroup>
          <Label for="signUpEmail">Email</Label>
          <Input
            type="email"
            name="email"
            id="signUpEmail"
            placeholder="enter your email"
            value={newUser.email}
            onChange={this.emailChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="signUpUsername">Username</Label>
          <Input
            type="username"
            name="username"
            id="signUpUsername"
            placeholder="enter your username"
            value={newUser.username}
            onChange={this.usernameChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="signUpPassword">Password</Label>
          <Input
            type="password"
            name="password"
            id="signUpPassword"
            placeholder="enter your password"
            value={newUser.password}
            onChange={this.passwordChange}
          />
        </FormGroup>
        <Button className="btn btn-dark mt-4" onClick={this.saveUser}>Sign Up</Button>
        </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default SignUp;
