import React, { forwardRef, InputHTMLAttributes } from "react";
import "./css/input.css";
import { Form } from "antd";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  name: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ placeholder, name, type, ...rest }: Props, ref) => {
    return (
      <div style={{ width: "100%" }}>
        <label className={"normalLabel"}>{placeholder}</label>
        <Form.Item name={name} style={{ margin: 0 }}>
          <input
            ref={ref}
            name={name}
            id={name}
            placeholder=" "
            className="floatingInput"
            {...rest} // Ensure other props are passed correctly
          />
        </Form.Item>
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
