import React, { Component, ChangeEvent, FormEvent } from "react";

import style from './Form.module.css';

interface IProps {
  submitButtonValue?: string;
  onSubmit(data: fromControl): void;
  render(
    formControlOnChange: (event: ChangeEvent<HTMLInputElement>) => void
  ): JSX.Element;
}

interface IState {
  submitButtonValue: string;
  formControls: fromControl;
}

export type fromControl = {
  [index: string]: string;
};

class Form extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      submitButtonValue: this.props.submitButtonValue || "Submit",
      formControls: {}
    };
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState({
      formControls: {
        [name]: value
      }
    });
  };

  onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.onSubmit(this.state.formControls);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        {this.props.render(this.handleChange)}
        <div className="field">
          <div className="control has-text-centered">
            <button className={`${style['submit-button']}`} type="submit">
              {this.state.submitButtonValue}
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default Form;
