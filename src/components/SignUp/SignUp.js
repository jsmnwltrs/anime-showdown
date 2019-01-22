import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import userRequests from '../../helpers/data/userRequests';
import './SignUp.scss';

const defaultUser = {
  email: '',
  username: '',
  password: '',
  characterTokens: 4,
  levelUpTokens: 2,
};


class SignUp extends React.Component {
  state = {
    newUser: defaultUser,
  }

  saveUser = (e) => {
    e.preventDefault();
    userRequests.addUser(this.newUser).then(() => {
      // this.props.history.push('/auth');
      this.setState({ newUser: defaultUser });
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
        <Button className="btn btn-dark mt-4" onClick={this.saveUser}>SignUp</Button>
        </Form>
      </div>
    );
  }
}

export default SignUp;
