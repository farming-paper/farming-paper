// component for simple dropdown button.
//

import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ISimpleDropdownButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

// This component is a simple dropdown button and forwrad ref.
const SimpleDropdownButton = forwardRef<
  HTMLButtonElement,
  ISimpleDropdownButtonProps
>((props, ref) => {
  const { children, ...rest } = props;
  return (
    <button
      ref={ref}
      {...rest}
      className={twMerge(
        "inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-100",
        rest.className
      )}
    >
      {children}
    </button>
  );
});

SimpleDropdownButton.displayName = "SimpleDropdownButton";

export default SimpleDropdownButton;
