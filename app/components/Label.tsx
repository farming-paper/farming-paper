import React from "react";
import { twMerge } from "tailwind-merge";

interface ILabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  children: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, ILabelProps>((props, ref) => {
  return (
    <label
      ref={ref}
      {...props}
      className={twMerge("text-gray-500 text-sm py-1", props.className)}
    >
      {props.children}
    </label>
  );
});

Label.displayName = "Label";

export default Label;
