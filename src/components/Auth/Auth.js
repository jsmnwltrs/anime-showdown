import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import authRequests from '../../helpers/data/authRequests';
import SignUp from '../SignUp/SignUp';
import './Auth.scss';

const defaultUser = {
  email: '',
  password: '',
};

class Auth extends React.Component {
  state = {
    existingUser: defaultUser,
  }

  authenticateUser = (e) => {
    e.preventDefault();
    const { existingUser } = this.state;
    const emailInput = existingUser.email;
    const passwordInput = existingUser.password;
    authRequests.authenticate(emailInput, passwordInput);
  }

  formFieldStringState = (name, e) => {
    e.preventDefault();
    const tempUser = { ...this.state.existingUser };
    tempUser[name] = e.target.value;
    this.setState({ existingUser: tempUser });
  }

  emailChange = e => this.formFieldStringState('email', e);

  passwordChange = e => this.formFieldStringState('password', e);

  render() {
    const { existingUser } = this.state;
    return (
      <div className="Auth">
       <Form>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            placeholder="enter your email"
            value={existingUser.email}
            onChange={this.emailChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input
            type="password"
            name="password"
            id="examplePassword"
            placeholder="enter your password"
            value={existingUser.password}
            onChange={this.passwordChange}
          />
        </FormGroup>
        <Button className="btn btn-dark mt-4" onClick={this.authenticateUser}>Login</Button>
        </Form>
        <SignUp />
      </div>
    );
  }
}

export default Auth;
