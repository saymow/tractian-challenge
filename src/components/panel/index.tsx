import cn from "classnames";
import PanelHeader, { Props as PanelHeaderProps } from "./panel-header";
import "./panel.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
  header?: PanelHeaderProps;
}

const Panel: React.FC<Props> = (props) => {
  return (
    <section className={cn("panel", props.className)}>
      {props.header && <PanelHeader {...props.header} />}
      {props.children}
    </section>
  );
};

export default Panel;
