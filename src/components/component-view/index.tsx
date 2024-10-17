import { Component } from "../../data/data-models";
import styles from "./component.module.css";

interface Props {
  component: Component;
}

const ComponentView: React.FC<Props> = (props) => {
  const { component } = props;

  return (
    <article className={styles.component}>
      <header>
        <h2>{component.name}</h2>
      </header>
      <section className={styles.component_info}>
        <article className={styles.component_main_info}>
          <img
            src="./component-sample.png"
            alt="A sample component image"
            className={styles.component_image}
          />
          <section className={styles.component_additional_info}>
            <div className={styles.component_data_value}>
              <strong>Tipo do equipamento</strong>
              <p>Tipo de Equipamento Motor Elétrico (Trifásico)</p>
            </div>
            <hr />
            <div className={styles.component_data_value}>
              <strong>Responsáveis</strong>
              <div>
                <img src="./avatar.png"></img>
                <p>Elétrica</p>
              </div>
            </div>
          </section>
        </article>
        <footer>
          <div className={styles.component_data_value}>
            <strong>Sensor</strong>
            <div>
              <img src="./Sensor.png"></img>
              <p>{component.sensorId}</p>
            </div>
          </div>
          <div className={styles.component_data_value}>
            <strong>Receptor</strong>
            <div>
            <img src="./MdOutlineRouter.png"></img>
              <p>Receptor EUH4R27</p>
            </div>
          </div>
        </footer>
      </section>
    </article>
  );
};

export default ComponentView;
