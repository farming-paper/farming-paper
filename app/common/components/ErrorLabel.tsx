import React from "react";
import { twMerge } from "tailwind-merge";

interface IErrorLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  children: React.ReactNode;
}

const ErrorLabel = React.forwardRef<HTMLLabelElement, IErrorLabelProps>(
  (props, ref) => {
    return (
      <label
        ref={ref}
        {...props}
        className={twMerge(" text-red-400 py-1", props.className)}
      >
        {props.children}
      </label>
    );
  }
);

ErrorLabel.displayName = "ErrorLabel";

export default ErrorLabel;
