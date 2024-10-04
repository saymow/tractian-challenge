import { useMemo, useState } from "react";
import { Asset, Company, Component, Location } from "../../../data/data-models";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import cn from "classnames";
import "./styles.scss";

export type RootNode = Company;
export type NonRootNode = Location | Asset | Component;
export type TreeNode = RootNode | NonRootNode;

interface Props {
  item: TreeNode;
  onClick: (node: TreeNode) => void;
}


/**
 * @docs returns 'undefined' if not loaded yet
 */
function getSubItems(item: TreeNode): NonRootNode[] | undefined {
  if (item instanceof Company) {
    return item.locations;
  } else if (item instanceof Location) {
    if (!("assets" in item) && !("children" in item)) {
      return undefined;
    }

    return [...(item.assets ?? []), ...(item.children ?? [])];
  } else if (item instanceof Asset) {
    if (!("components" in item) && !("children" in item)) {
      return undefined;
    }

    return [...(item.components ?? []), ...(item.children ?? [])];
  } else {
    return [];
  }
}

const TreeItem: React.FC<Props> = (props) => {
  const { item, onClick } = props;
  const [isOpen, setIsOpen] = useState(false);
  const subItems: NonRootNode[] | undefined = useMemo(
    () => getSubItems(item),
    [item]
  );

  const handleClick = () => {
    if (!isOpen) onClick(item);
    setIsOpen((prev) => !prev);
  };

  const icon = useMemo(() => {
    let iconName = "location";

    if (item instanceof Company || item instanceof Location) {
      iconName = "location";
    } else if (item instanceof Asset) {
      iconName = "asset";
    } else {
      iconName = "component";
    }

    return <img src={`/${iconName}.png`}></img>;
  }, [item]);

  const children = useMemo(() => {
    if (!isOpen) return null;

    return (
      <ul className="tree-container">
        {subItems?.map((subItem) => (
          <TreeItem key={subItem.id} item={subItem} onClick={onClick} />
        ))}
      </ul>
    );
  }, [isOpen, onClick, subItems]);

  const expandIcon = useMemo(() => {
    if (subItems?.length == 0) return null;
    if (isOpen) return <ExpandLessIcon />;
    else return <ExpandMoreIcon />;
  }, [isOpen, subItems]);

  return (
    <li className={cn("tree-item", { expandless: !expandIcon })}>
      <span onClick={handleClick}>
        {expandIcon}
        {icon}
        {item.name}
      </span>
      {children}
    </li>
  );
};

export default TreeItem;
