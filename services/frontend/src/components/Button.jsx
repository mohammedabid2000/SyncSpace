import { buttonClasses } from "./buttonStyles";

// <Button variant="primary" size="lg" onClick={…}><Icon /> Text</Button>
function Button({ variant, size, className, type = "button", ...props }) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}

export default Button;
