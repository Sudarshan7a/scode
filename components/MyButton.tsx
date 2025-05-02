import React from "react";

function MyButton({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & {
  [key: string]: string | number | boolean | undefined;
}) {
  // Check if children contain a button element
  const hasButtonChild = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      (child.type === "button" ||
        (typeof child.type === "function" && child.type.name === "Button"))
  );

  // If there's a button in children, use a div instead of another button
  const Component = hasButtonChild ? "div" : "button";

  return (
    <Component
      className={`style-button ${className}`}
      {...(hasButtonChild ? {} : props)}
    >
      {children}
    </Component>
  );
}

export default MyButton;
