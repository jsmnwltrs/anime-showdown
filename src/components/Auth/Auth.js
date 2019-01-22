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

class Auth extends React.Component {
  authenticateUser = (e) => {
    e.preventDefault();
    authRequests.authenticate().then(() => {
      this.props.history.push('/home');
    }).catch(error => console.error('error with auth', error));
  }

  render() {
    return (
      <div className="Auth">
       <Form>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="email" name="email" id="exampleEmail" placeholder="enter your email" />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input type="password" name="password" id="examplePassword" placeholder="enter your password" />
        </FormGroup>
        <Button className="btn btn-dark mt-4" onClick={this.authenticateUser}>Login</Button>
        </Form>
        <SignUp />
      </div>
    );
  }
}

export default Auth;
