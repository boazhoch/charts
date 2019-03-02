import React, { Component } from "react";
import Form from "../Form/Form";
import FormInput from "../FormInput/FormInput";

interface IProps {
  placeholder?: string;
  type: string;
  name: string;
  onSubmit(data: { [index: string]: string }): void;
}

class SearchBar extends Component<IProps> {
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
        submitButtonValue={"Add stock"}
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
