import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Field from 'components/common/Field';
import Check from 'components/common/Check';
import signup from '../../images/signup.jpg';
import { baseUrl } from 'utils/api';
import { Button } from 'primereact/button';
import  test from '../../images/2.jpeg';
import {Growl} from 'primereact/growl';
import {withRouter} from "react-router-dom";

/*import { validateName, validateEmail, validatePassword, validatePhone } from 'utils/formValidator.js';*/
class RegistrationPage extends Component {
  static propTypes = {
    styles: PropTypes.object.isRequired
  }
  constructor() {
    super();

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      repeatPassword: '',
      errors: {
        firstName: false,
        lastName: false,
        email: false,
        phoneNumber: false,
        password: false,
        repeatPassword: false,
      },
      responseStatusVisible: false,
      responseText: ""
    };
  }

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

	onSubmit = () => {
	  const errors = {};
	  const nameRegExp	= /^[a-zа-яієїґ\'\s]{2,30}$/i;


	  const emailRegExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;


	  //const phoneRegExp = /^[+38(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-/\s.]?[0-9]{4}$/;

	  if (this.state.firstName.length < 3 && !nameRegExp.test(this.state.firstName)) {
	    errors.firstName = 'Must be 3 characters or more, only letters';
	  }

	  if (this.state.lastName.length < 3 && !nameRegExp.test(this.state.lastName)) {
	    errors.lastName = 'Must be 3 characters or more';
	  }

	  if (!emailRegExp.test(this.state.email)) {
	    errors.email = 'Must be symbol @';
	  }

/*	  if (!phoneRegExp.test(this.state.phoneNumber)) {
	    errors.phoneNumber = 'Must be only digitals and +';
	  }*/

	  if (this.state.password < 8) {
	    errors.password = 'Must be 8 characters or more';
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
	    const { firstName, lastName, email, phoneNumber, password } = this.state;
	    fetch(`${baseUrl}register`, {
	      method: 'POST',
	      headers: {
          'Accept': 'application/json;charset=UTF-8',
          'Content-Type': 'application/json;charset=UTF-8'
	      },
	      body: JSON.stringify({
	        firstName, lastName, email, phoneNumber, password
	      })
	    }).then(resp => {
        console.log('resp', resp);
        if (resp.status === 201) {
          this.setState({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            repeatPassword: ''
          });
        }
        return resp.json()
      })
      .then(data => {
          console.log('DATA', data)
          if (data.message) {
            this.growl.show({severity: 'success', summary: `${data.message}`});
            this.setState({
                responseStatusVisible: true,
                responseText: data.message
            });
          } else {
            this.growl.show({severity: 'success', summary: `${data.cause}`});
            this.setState({
                responseStatusVisible: true,
                responseText: data.cause
            });
          }
      })
        .catch(error => {
          this.growl.show({severity: 'error', summary: `${error.message}`});
        });
	  }
	};

	render() {
    const { styles } = this.props;
    const { responseStatusVisible } = this.state;
	  return (
      <div className={styles.registrationPage}>
        <Growl ref={(el) => this.growl = el} />
        <div className={styles.registrationPageLeft}>
          <p>Have some stuff to share?</p>
          <p>Easy way to earn money from stuff that is not in use</p>
          <img src={test} />
          <p>Sign up and start to share</p>
        </div>

        <div className={styles.registrationPageRight}>
          <h2>Sign Up</h2>
          <div className="form-container card">

            { !responseStatusVisible &&
              <form className="form card-body">
                <Field
                      id="firstName"
                      labelText="First Name"
                      type="text"
                      placeholder="Enter first name"
                      name="firstName"
                      value={this.state.firstName}
                      onChange={this.onChange}
                      error={this.state.errors.firstName}
                    />
                <Field
                      id="lastName"
                      labelText="Last Name"
                      type="text"
                      placeholder="Enter last name"
                      name="lastName"
                      value={this.state.lastName}
                      onChange={this.onChange}
                      error={this.state.errors.lastName}
                    />
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
                      id="phoneNumber"
                      labelText="Phone Number"
                      type="text"
                      placeholder="Enter phone (000)-000-0000"
                      name="phoneNumber"
                      value={this.state.phoneNumber}
                      onChange={this.onChange}
                      error={this.state.errors.phoneNumber}
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
                <Button
                  label='Register'
                  type="button"
                  className="btn"
                  onClick={() => {
                    this.onSubmit();
                    setTimeout(() =>
                        this.props.history.push("/login")
                      , 3000);
                  }}
                />
              </form>
            }
          </div>
        </div>
      </div>
	  );
	}
}

export default withRouter(RegistrationPage);
