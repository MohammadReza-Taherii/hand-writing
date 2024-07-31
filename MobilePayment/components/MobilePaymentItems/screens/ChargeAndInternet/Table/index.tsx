import { useState } from "react";
import { Button, Table } from "antd";
import { useSelector } from "react-redux";
import { StateNetwork } from "store/index.reducer";
import { rowCalculator, toIrCurrency } from "helpers/index";
import styles from "./index.module.scss";
import CustomCard from "components/CustomCard";
import useMobilePayment from "hooks/mobilePayment.hooks";
import { baseUrl } from "services/http/apiUrls";
import type { ColumnsType } from "antd/es/table/interface";
import { MobilePaymentState } from "store/MobilePayment/mobilePayment.reducer";
import { ChargeAndInternetContent, ISortKeys, OrderKeys, RequestData } from "types/mobilePayment";
import { http } from "services/http/newbase";
import { FilterValue, SorterResult, TablePaginationConfig } from "antd/lib/table/interface";
import AlertBox from "components/AlertBox";

interface ChargeAndInernetInquiryProps {
	paymentId: string | number;
	paymentStatus: string;
}

interface TableDataProps {
	pagination: RequestData;
	onChange?: (
		pagination: TablePaginationConfig,
		filters: Record<string, FilterValue | null>,
		sorter: SorterResult<ChargeAndInternetContent> | SorterResult<ChargeAndInternetContent>[],
	) => void;
	sortKey?: keyof ISortKeys;
	orderKey?: OrderKeys;
}

interface ChargeAndInernetTableProps {
	pagination: RequestData;
	onChange?: (
		pagination: TablePaginationConfig,
		filters: Record<string, FilterValue | null>,
		sorter: { columnKey: keyof ISortKeys; order: "ascend" | "descend" } & any,
	) => void;
	sortKey?: keyof ISortKeys;
	orderKey?: OrderKeys;
}

const ChargeAndInernetInquiry: React.FC<ChargeAndInernetInquiryProps> = (props) => {
	const { paymentId, paymentStatus } = props;
	const [loading, setLoading] = useState(false);
	const { updateOneChargeAndInternet } = useMobilePayment();

	const getChargeAndInternetInquiry = async (paymentId: string | number) => {
		setLoading(true);
		try {
			const response: ChargeAndInternetContent = await http.post(
				`${baseUrl}/v1/panel/payment/payments/resolve-incomplete-payment/${paymentId}`,
			);
			updateOneChargeAndInternet(response);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching data:", error);
			AlertBox({ text: "خطایی رخ داده است", type: "error", show: true });
			setLoading(false);
		}
	};

	if (paymentStatus === "REVERSED" || paymentStatus === "PURCHASED") return null;

	return (
		<Button
			className={styles["detail-button"]}
			type="primary"
			onClick={() => getChargeAndInternetInquiry(paymentId)}
			loading={loading}
			style={{ minWidth: 100 }}
		>
			استعلام
		</Button>
	);
};

const TableData: React.FC<TableDataProps> = ({ pagination, onChange, sortKey, orderKey }) => {
	const { chargeAndInernet, chargeAndInernetLoading } = useSelector<StateNetwork, MobilePaymentState>(
		(state) => state.mobilePayment,
	);

	const columns: ColumnsType<ChargeAndInternetContent> = [
		{
			title: "ردیف",
			render: (_: string, __: unknown, index: number) => {
				return rowCalculator({ page: Number(pagination.page), limit: Number(pagination.size) }, index);
			},
		},
		{
			title: "اپراتور",
			dataIndex: "operatorLocalized",
		},
		{
			title: "نوع سرویس",
			dataIndex: "serviceTypeLocalized",
		},
		{
			title: "شماره مشتری",
			dataIndex: "cif",
		},
		{
			title: "شماره موبایل",
			dataIndex: "mobileNumber",
		},
		{
			title: "مبلغ (ریال)",
			dataIndex: "price",
			render: (value: string) => toIrCurrency(value),
		},
		{
			title: "شماره پیگیری اپراتور",
			dataIndex: "providerReferenceNumber",
		},
		{
			title: "شماره سند تراکنش اصلی",
			dataIndex: "withdrawReferenceNumber",
		},
		{
			title: "تاریخ و ساعت انجام تراکنش اصلی",
			dataIndex: "paymentTime",
			key: "PAYMENT_TIME",
			sorter: true,
		},
		{
			title: "تاریخ و ساعت انجام تراکنش برگشتی",
			dataIndex: "paymentReverseTime",
			key: "PAYMENT_REVERSE_TIME",
			sorter: true,
		},
		{
			title: "وضعیت تراکنش",
			dataIndex: "paymentStatusLocalized",
		},
		{
			title: "عملیات",
			render: (_: string, record: ChargeAndInternetContent) => (
				<ChargeAndInernetInquiry paymentId={record.id ?? ""} paymentStatus={record.paymentStatus ?? ""} />
			),
		},
	];

	const newColumns: ColumnsType<ChargeAndInternetContent> = columns.map((obj) => {
		if (obj.key === sortKey) {
			return { ...obj, defaultSortOrder: orderKey === "DESC" ? "descend" : "ascend" };
		}
		return obj;
	});

	return (
		<>
			<CustomCard title="اطلاعات شارژ و بسته اینترنت">
				<Table
					rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
					dataSource={chargeAndInernet?.content}
					columns={newColumns}
					loading={chargeAndInernetLoading}
					rowKey={(record: ChargeAndInternetContent) => record?.id ?? ""}
					pagination={{
						showSizeChanger: false,
						showTitle: false,
						total: chargeAndInernet?.totalElements,
						pageSize: Number(pagination?.size),
						current: Number(pagination?.page),
						hideOnSinglePage: true,
						position: ["bottomLeft"],
					}}
					onChange={onChange}
				/>
			</CustomCard>
		</>
	);
};

export default TableData;
