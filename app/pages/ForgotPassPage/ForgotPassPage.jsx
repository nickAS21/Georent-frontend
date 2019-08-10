import React, {Component} from 'react';
import Field from 'components/common/Field';
import {baseUrl} from 'utils/api';
import PropTypes from 'prop-types';
import signup from '../../images/signup.jpg';
import queryString from 'query-string'
import {Helmet} from 'react-helmet';
import {Button} from 'primereact/button';

class ForgotPassPage extends Component {
  static propTypes = {
    styles: PropTypes.object.isRequired
  };

  constructor() {
    super();

    this.state = {
      password: '',
      repeatPassword: '',
      errors: {
        password: false,
        repeatPassword: false,
      },
      responseStatusVisible: false,
      responseText: ""
    };
  };

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onCheck = (event) => {
    this.setState({
      [event.target.name]: event.target.checked
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    const passwordRegExp = /[^A-Za-z0-9_-]/;
    if (this.state.password.length < 8) {
      errors.password = 'Must be 8 characters or more';
    }

    if (this.state.password.length > 64) {
      errors.password = 'Must be 64 characters or less';

    }

    var st = passwordRegExp.test(password);
    if (passwordRegExp.test(this.state.password)) {
      if (errors.password != null && errors.password.length > 0) {
        errors.password += ' Must be only latin letters or numbers';
      } else {
        errors.password = 'Must be only latin letters or numbers';
      }
    }

    if (this.state.password !== this.state.repeatPassword) {
      errors.repeatPassword = 'Must be equal password';
    }

    if (Object.keys(errors).length > 0) {
      this.setState({
        errors
      });
    } else {
      this.setState({
        errors: {}
      });

      console.log('submit', this.state);
      const values = queryString.parse(this.props.location.search);
      const {password} = this.state;
      fetch(`${baseUrl}forgotpassword/save`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json;charset=UTF-8',
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Headers': 'authorization',
          'Content-Type': 'application/json',
          'Authorization': `${values.tokentype || ''} ${values.accesstoken || ''}`
        },
        body: JSON.stringify({
          password
        })
      })
        .then(resp => {
          console.log('resp', resp);
          if (resp.status === 301) {
            this.setState({
              password: '',
              repeatPassword: ''
            });
          }
          return resp.json()
        })
        .then(data => {
          console.log('DATA', data)
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
        });
    }
  };


  render() {
    const {styles} = this.props;
    const {responseStatusVisible} = this.state;
    return (
      <div>
        <Helmet>
          <title>Forgot Page</title>
          <meta
            name="description"
            content="Forgot Page"
          />
        </Helmet>
        <div className={styles.forgotPage}>
          <title>Registration Page</title>
          <div className={styles.forgotPageLeft}>
            <p>Have some stuff to share?</p>
            <p>Easy way to earn money from stuff that is not in use</p>
            <img src={signup}/>
            <p>Recover password and start sharing</p>
          </div>

          <div className={styles.forgotPageRight}>
            <h2>Change password</h2>
            <div className="form-container card">
              {responseStatusVisible &&
              <div>
                <h2>
                  {this.state.responseText}
                </h2>
              </div>
              }

              {!responseStatusVisible &&
              <form className="form card-body">
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
                <Field
                  id="repeatPassword"
                  labelText="Repeat password"
                  type="password"
                  placeholder="Repeat password"
                  name="repeatPassword"
                  value={this.state.repeatPassword}
                  onChange={this.onChange}
                  error={this.state.errors.repeatPassword}
                />
                <div>
                  <Button
                    label='Click after entering a new passwordt'
                    type="revers"
                    className="btn"
                    onClick={this.onSubmit}
                  >
                  </Button>
                </div>
              </form>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ForgotPassPage;
