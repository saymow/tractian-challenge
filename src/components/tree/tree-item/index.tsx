import React, { useMemo, useState } from "react";
import { Asset, Company, Component, Location } from "../../../data/data-models";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import cn from "classnames";
import "./styles.scss";

export type RootNode = Company;
export type NonRootNode = Location | Asset | Component;
export type TreeNode = RootNode | NonRootNode;

interface Props<T> {
  item: T;
  onClick: (node: TreeNode, open: boolean) => void;
}

const TreeCompany: React.FC<Props<Company>> = (props) => {
  const { item, onClick } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    onClick(item, !isOpen);
    setIsOpen((prev) => !prev);
  };

  const expandIcon = useMemo(() => {
    if (isOpen) return <ExpandLessIcon />;
    else return <ExpandMoreIcon />;
  }, [isOpen]);

  const children = useMemo(() => {
    if (!isOpen || !item.locations) return null;

    return (
      <ul className="subtree-container">
        {item.locations.map((subItem) => (
          <TreeItem key={subItem.id} item={subItem} onClick={onClick} />
        ))}
      </ul>
    );
  }, [item, isOpen, onClick]);

  return (
    <li className={cn("tree-item", { expandless: !expandIcon })}>
      <span onClick={handleClick}>
        {expandIcon}
        <img src={"./location.png"}></img>
        {item.name}
      </span>
      {children}
    </li>
  );
};

const TreeLocation: React.FC<Props<Location>> = (props) => {
  const { item, onClick } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const expandIcon = useMemo(() => {
    if (!item.assets && !item.children) return null;
    if (isOpen) return <ExpandLessIcon />;
    else return <ExpandMoreIcon />;
  }, [isOpen, item]);

  const children = useMemo(() => {
    if (!isOpen || (!item.assets && !item.children)) return null;

    return (
      <ul className="subtree-container">
        {(item.children ?? []).map((subItem) => (
          <TreeItem key={subItem.id} item={subItem} onClick={onClick} />
        ))}
        {(item.assets ?? []).map((subItem) => (
          <TreeItem key={subItem.id} item={subItem} onClick={onClick} />
        ))}
      </ul>
    );
  }, [item, isOpen, onClick]);

  return (
    <li className={cn("tree-item", { expandless: !expandIcon })}>
      <span onClick={handleClick}>
        {expandIcon}
        <img src={"./location.png"}></img>
        {item.name}
      </span>
      {children}
    </li>
  );
};

const TreeAsset: React.FC<Props<Asset>> = (props) => {
  const { item, onClick } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const expandIcon = useMemo(() => {
    if (!item.children && !item.components) return null;
    if (isOpen) return <ExpandLessIcon />;
    else return <ExpandMoreIcon />;
  }, [isOpen, item.children, item.components]);

  const children = useMemo(() => {
    if (!isOpen || (!item.components && !item.children)) return null;

    return (
      <ul className="subtree-container">
        {(item.children ?? []).map((subItem) => (
          <TreeItem key={subItem.id} item={subItem} onClick={onClick} />
        ))}
        {(item.components ?? []).map((subItem) => (
          <TreeItem key={subItem.id} item={subItem} onClick={onClick} />
        ))}
      </ul>
    );
  }, [item, isOpen, onClick]);

  return (
    <li className={cn("tree-item", { expandless: !expandIcon })}>
      <span onClick={handleClick}>
        {expandIcon}
        <img src={"./asset.png"}></img>
        {item.name}
      </span>
      {children}
    </li>
  );
};

const TreeComponent: React.FC<Props<Component>> = (props) => {
  const { item, onClick } = props;

  const handleClick = () => {
    onClick(item, true);
  };

  return (
    <li
      className={cn("tree-item", "expandless", "component", {
        active: item.selected,
      })}
    >
      <span onClick={handleClick}>
        <img src="./component.png"></img>
        {item.name}
      </span>
    </li>
  );
};

const TreeItem: React.FC<Props<TreeNode>> = (props) => {
  const { item, onClick } = props;

  if (item instanceof Company) {
    return <TreeCompany item={item} onClick={onClick} />;
  } else if (item instanceof Location) {
    return <TreeLocation item={item} onClick={onClick} />;
  } else if (item instanceof Asset) {
    return <TreeAsset item={item} onClick={onClick} />;
  } else {
    return <TreeComponent item={item} onClick={onClick} />;
  }
};

export default TreeItem;
