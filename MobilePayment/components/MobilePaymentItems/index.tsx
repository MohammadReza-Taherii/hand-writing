import React from "react";
import { Button, Dropdown, MenuProps, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import type { ParamTypes } from "types/index";
import styles from "./index.module.scss";

const MobilePaymentItems: React.FC = () => {
	const history = useHistory();
	// cif = 30000359
	const { id } = useParams<ParamTypes>();

	const items: MenuProps["items"] = [
		{
			label: "قبوض",
			key: "bills",
		},
		{
			type: "divider",
		},
		{
			label: "شارژ و بسته",
			key: "charge-and-internet",
		},
		{
			type: "divider",
		},
		{
			label: "کارمزد خلافی",
			key: "vehicle-bill-fees",
		},
		{
			type: "divider",
		},
		{
			label: "پرداخت خلافی",
			key: "vehicle-bills",
		},
	];

	const handleMenuClick: MenuProps["onClick"] = (e) => {
		if (e.key === "bills") history.push(`/dashboard/reports/${e.key}${id ? `?customerId=${id}&cif=${id}` : ""}`);
		else history.push(`/dashboard/reports/mobile-payment/${e.key}${id ? `?customerId=${id}&cif=${id}` : ""}`);
	};

	const menuProps = {
		items,
		onClick: handleMenuClick,
	};

	return (
		<Dropdown menu={menuProps} trigger={["click"]}>
			<Button size="large" type="default" className={styles["dropdown-button"]}>
				<Space>
					گزارش اپراتورها
					<DownOutlined />
				</Space>
			</Button>
		</Dropdown>
	);
};

export default MobilePaymentItems;
