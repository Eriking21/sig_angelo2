import { HTMLAttributes } from "react";
import styles from "./loading.module.css";

export default function LoadingScreen(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={styles["loading-screen"]} {...props}>
      <div className={styles["loading-container"]}>
        <div className={styles["spinner"]}>
          <span className={styles["antispin"]}>Carregando...</span>
        </div>
        <div className={styles["loading-text"]}>
          Não falta muito, espere só mais um pouco.
        </div>
      </div>
    </div>
  );
}
