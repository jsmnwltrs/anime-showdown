import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Container,
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
  <Container className="auth">
    <Row>
      <Col><h1 className='loginHeader m-5'>Anime Showdown</h1></Col>
    </Row>
    <Row>
      <Col><Form className='mt-2 mb-4' onSubmit={this.authenticateUser}>
        <FormGroup className='d-flex justify-content-center'>
          <Label className='mr-5' for="exampleEmail">Email:</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            placeholder="enter your email"
            value={existingUser.email}
            onChange={this.emailChange}
          />
        </FormGroup>
        <FormGroup className='d-flex justify-content-center'>
          <Label className='mr-3' for="examplePassword">Password:</Label>
          <Input
            type="password"
            name="password"
            id="examplePassword"
            placeholder="enter your password"
            value={existingUser.password}
            onChange={this.passwordChange}
          />
        </FormGroup>
        <Button className="btn btn-dark mt-2" onClick={this.authenticateUser}>Login</Button>
      </Form></Col>
    </Row>
    <Row className="m-3">
      <Col><SignUp /></Col>
    </Row>
</Container>
    );
  }
}

export default Auth;
