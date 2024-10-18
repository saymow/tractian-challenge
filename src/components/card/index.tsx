import cn from "classnames";
import "./styles.scss";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<Props> = ({ children, className }) => {
  return <section className={cn("card", className)}>{children}</section>;
};

export default Card;
