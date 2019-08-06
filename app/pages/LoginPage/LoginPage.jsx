import React, {Component} from 'react';
import Field from 'components/common/Field';
import {baseUrl} from 'utils/api';
import PropTypes from 'prop-types';
import {Button} from 'primereact/button';

class LoginPage extends Component {
  static propTypes = {
    styles: PropTypes.object.isRequired
  };

  constructor() {
    super();

    this.state = {
      email: 'user1@gmail.com.ua',
      password: 'password1',
      errors: {
        email: false,
        password: false,
        repeatPassword: false
      },
      forgotPassVisible: false,
      responseStatusVisible: false,
      responseText: ""
    };
  };

  // componentDidMount = () => {
  //   this.setState({
  //     newPassVisible: this.props.location.pathname === "/login/newpass"
  //   });
  // }
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  onForgot = (event) => {
    this.setState({
      forgotPassVisible: true,
      responseStatusVisible: false,
      responseText: ""
    });
  };
  onForgotBack = (event) => {
    this.setState({
      forgotPassVisible: false,
      responseStatusVisible: false,
      responseText: ""
    });
  };
  onForgotSubmit = (event) => {
    event.preventDefault();
    const {email} = this.state;
    const api = window.location.origin;
    fetch(`${baseUrl}forgotpassword`,
      {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          api
        })
      }
    )
      .then(resp => {
        console.log('resp onForgot', resp);
        if (resp.status === 301) {
          this.setState({
            tokenType: '',
            accessToken: '',
            password: ''
            // repeatPassword: ''
          });
          this.setState({forgotPassVisible: false});
        }
        return resp.json()
      })
      .then(data => {
        console.log('DATA', data)
        if (data) {
          if (data.message) {
            this.setState({
              responseStatusVisible: true,
              responseText: data.message
            });
          } else {
            this.setState({
              responseStatusVisible: true,
              responseText: data.cause
            });
          }
        }
      });
  };

  onSubmit = (event) => {
    this.setState({
      forgotPassVisible: false,
      responseStatusVisible: false,
      responseText: ""
    });
    event.preventDefault();
    const errors = {};
    const emailRegExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;

    if (!emailRegExp.test(this.state.email)) {
      errors.email = 'Must be symbol @';
    }

    if (this.state.password < 8) {
      errors.password = 'Must be 8 characters or more';
    }

    if (Object.keys(errors).length > 0) {
      this.setState({
        errors
      });
    } else {
      this.setState({
        errors: {}
      });

      const {email, password} = this.state;
      fetch(`${baseUrl}login`, {
        method: "POST",
        body: JSON.stringify({
          email, password
        }),
        headers: {
          'Access-Control-Allow-Headers': 'authorization',
          'Content-Type': 'application/json'
        }
      })
        .then(resp => {
          console.log('resp', resp);
          return resp.json()
        })
        .then(data => {
          console.log('DATA', data);
          if (data) {
            if (data.accessToken) {
              window.localStorage.setItem("jwt", data.accessToken);
              this.props.onLogin();
              window.location.assign('/profile');
            } else if (data.message) {
              this.setState({
                responseStatusVisible: true,
                responseText: data.message
              });
            }
          }
        });
    }
  };

  render() {
    const {styles} = this.props;
    const {responseStatusVisible, responseText, forgotPassVisible, newPassVisible} = this.state;
    return (
      <div className={styles.loginPage}>
        <h2>Login Form</h2>
        <div className={styles.form}>
          {responseStatusVisible &&
          <div className={styles.loginPage_message}>
            <h2>
              {responseText}
            </h2>
          </div>
          }

          {forgotPassVisible &&
          <div>
            <Field
              id="email"
              labelText="Email"
              type="text"
              placeholder="Enter email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              error={this.state.errors.email}
            />
            <Button
              label='Submit'
              type="submit"
              className="btn"
              onClick={this.onForgotSubmit}
            >
            </Button>
            <Button
              label='Back'
              type="button"
              className="btn"
              onClick={this.onForgotBack}
            >
            </Button>
          </div>
          }

          {!forgotPassVisible &&
          <div>
            <Field
              id="email"
              labelText="Email"
              type="text"
              placeholder="Enter email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              error={this.state.errors.email}
            />
            <Field
              id="password"
              labelText="Password"
              type="password"
              placeholder="Enter password"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
              error={this.state.errors.password}
            />
            <Button
              label="Submit"
              type="submit"
              className="btn"
              onClick={this.onSubmit}
            />
            <Button
              label="Forgot password"
              type="button"
              className="btn"
              onClick={this.onForgot}
            />
          </div>
          }
        </div>
      </div>
    );
  }
}

export default LoginPage;
