import React, { Component, ChangeEvent } from "react";
import style from "./Input.module.css";

interface IProps {
  value?: string;
  type: string;
  name: string;
  placeholder?: string;
  onChange(event: ChangeEvent<HTMLInputElement>): void;
  onValidate(value: string): boolean;
}

class FormInput extends Component<IProps> {
  state = {
    value: this.props.value || "",
    isTouched: false,
    isValid: false
  };

  // Callback Function
  onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value }
    } = event;

    this.changeStateValue(value, true, this.validateValue(value));

    if (this.state.isValid) {
      this.props.onChange(event);
    }
  };

  changeStateValue(value: string, isTouched: boolean, isValid: boolean) {
    this.setState({
      value: value,
      isTouched: isTouched || false,
      isValid: isValid || false
    });
  }

  validateValue(value: string) {
    return this.props.onValidate(value);
  }

  getValidClassName() {
    if (!this.state.isTouched) {
      return;
    }
    if (this.state.isValid) {
      return style["is-valid"];
    }
    return style["is-invalid"];
  }

  render() {
    const { onValidate, ...props } = this.props;
    return (
      <input
        className={`input ${style.input} ${this.getValidClassName()}`}
        {...props}
        onChange={this.onChange}
        value={this.state.value}
      />
    );
  }
}

export default FormInput;
