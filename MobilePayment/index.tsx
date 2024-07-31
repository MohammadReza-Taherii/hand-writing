import React from "react";
import styles from "./index.module.scss";
import MobilePaymentItems from "./components/MobilePaymentItems";
import { Card } from "antd";

const MobilePayment: React.FC = () => {
	return (
		<div className={styles["search-container"]}>
			<Card className={styles["card-container"]}>
				<MobilePaymentItems />
			</Card>
		</div>
	);
};

export default MobilePayment;
