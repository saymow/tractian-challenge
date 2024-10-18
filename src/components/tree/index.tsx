import cn from "classnames";
import { Company, Node } from "../../data/data-models";
import { ExternalData } from "../../data/data-type";
import "./styles.scss";
import TreeItem from "./tree-item";

interface Props {
  companies: ExternalData<Company[]>;
  onNodeClick: (node: Node) => void;
  className?: string;
}

const Tree: React.FC<Props> = (props) => {
  const { companies, onNodeClick, className } = props;

  return (
    <ul className={cn("tree-container", className)}>
      {companies.data?.map((company) => (
        <TreeItem
          key={company.id}
          item={company}
          onClick={onNodeClick}
        ></TreeItem>
      ))}
    </ul>
  );
};

export default Tree;
