import cn from "classnames";
import "./styles.scss";

interface Props {
  text: string;
  Icon: React.FC<{ fill?: string }>;
  active?: boolean;
  className?: string;
  onClick?: VoidFunction;
}

const Button: React.FC<Props> = (props) => {
  const { Icon, text, className, active, onClick } = props;

  return (
    <button
      onClick={onClick}
      data-active={active}
      className={cn("button", className)}
    >
      {<Icon fill={active ? "#fff" : "#2188ff"} />} {text}
    </button>
  );
};

export default Button;
