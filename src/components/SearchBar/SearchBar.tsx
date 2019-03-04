import React, { Component } from "react";
import Form from "../Form/Form";
import FormInput from "../FormInput/FormInput";

export interface ISearchBarProps {
  placeholder?: string;
  type: string;
  name: string;
  submitButtonText?: string;
  onSubmit(data: { [index: string]: string }): void;
}

class SearchBar extends Component<ISearchBarProps> {
  state = {
    value: ""
  };

  handleValidation = (value: string) => {
    if (/^[a-zA-Z]+$/.test(value)) {
      return true;
    }
    return false;
  };

  handleSubmit = (data: any) => {
    this.props.onSubmit(data);
  };

  render() {
    return (
      <Form
        submitButtonValue={this.props.submitButtonText}
        onSubmit={this.handleSubmit}
        render={formControlOnChange => {
          return (
            <div className="field">
              <FormInput
                type={this.props.type}
                name={this.props.name}
                placeholder={this.props.placeholder}
                onValidate={this.handleValidation}
                onChange={formControlOnChange}
              />
            </div>
          );
        }}
      />
    );
  }
}

export default SearchBar;
