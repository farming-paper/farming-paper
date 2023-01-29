import { twMerge } from "tailwind-merge";

const NumberBall: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <span
      className={twMerge(
        "inline-flex items-center justify-center w-5 h-5 text-xs text-gray-400 bg-gray-100 rounded-full",
        className
      )}
    >
      {children}
    </span>
  );
};

export default NumberBall;
