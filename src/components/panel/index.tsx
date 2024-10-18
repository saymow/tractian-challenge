import "./panel.scss";
import cn from "classnames";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Panel: React.FC<Props> = (props) => {
  return <section className={cn("panel", props.className)}>{props.children}</section>;
};

export default Panel;
