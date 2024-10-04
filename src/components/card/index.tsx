import "./styles.scss";

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <section className="card">{children}</section>;
};

export default Card;
