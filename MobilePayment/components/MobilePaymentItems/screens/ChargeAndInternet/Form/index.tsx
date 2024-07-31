import React, { useEffect } from "react";
import { Row, Col, Form, Select, Button, Input, Collapse, Skeleton } from "antd";
import DatePicker from "components/DatePicker";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { toDayjs } from "helpers/calendar";
import { useSelector } from "react-redux";
import { StateNetwork } from "store/index.reducer";
import { MobilePaymentState } from "store/MobilePayment/mobilePayment.reducer";
import useMobilePayment from "hooks/mobilePayment.hooks";
import styles from "./index.module.scss";
import { ChargeAndInternetEntityParams, PaymentFiltersTypes, RequestData } from "types/mobilePayment";
import { SearchFormFields } from "types/index";

interface SearchFormProps {
	onReset: () => void;
	onSearch: (value: RequestData & ChargeAndInternetEntityParams) => void;
	filterParams?: RequestData & ChargeAndInternetEntityParams;
}

interface SearchFormProps {
	onReset: () => void;
	onSearch: (value: RequestData & ChargeAndInternetEntityParams) => void;
	filterParams?: RequestData & ChargeAndInternetEntityParams;
}

const allOptions = [{ label: "همه", value: null }];

const SearchForm: React.FC<SearchFormProps> = ({ onReset, onSearch, filterParams }) => {
	const [form] = Form.useForm();
	const { getChargeAndInternetFilters } = useMobilePayment();
	const { chargeAndInernetFilters, chargeAndInernetFiltersLoading } = useSelector<StateNetwork, MobilePaymentState>(
		(state) => state.mobilePayment,
	);

	useEffect(() => {
		getChargeAndInternetFilters();
	}, []);

	const operatorOptions = chargeAndInernetFiltersLoading
		? []
		: [
				...allOptions,
				...chargeAndInernetFilters?.operators?.map((o: PaymentFiltersTypes) => ({
					label: o.localizedKey,
					value: o.key,
				})),
		  ];

	const serviceTypeOptions = chargeAndInernetFiltersLoading
		? []
		: [
				...allOptions,
				...chargeAndInernetFilters?.serviceTypes?.map((o: PaymentFiltersTypes) => ({
					label: o.localizedKey,
					value: o.key,
				})),
		  ];

	const paymentStatusOtions = chargeAndInernetFiltersLoading
		? []
		: [
				...allOptions,
				...chargeAndInernetFilters?.paymentStatuses?.map((o: PaymentFiltersTypes) => ({
					label: o.localizedKey,
					value: o.key,
				})),
		  ];

	const fields: SearchFormFields[] = [
		{
			label: "اپراتور",
			name: "operator",
			component: Select,
			props: { options: operatorOptions },
			loading: chargeAndInernetFiltersLoading,
		},
		{
			label: "نوع سرویس",
			name: "serviceType",
			component: Select,
			props: { options: serviceTypeOptions },
			loading: chargeAndInernetFiltersLoading,
		},
		{
			label: "شماره مشتری",
			name: "cif",
			component: Input,
			props: {
				type: "text",
				disabled: !!filterParams?.customerId,
				allowClear: true,
			},
		},
		{
			label: "شماره موبایل",
			name: "mobileNumber",
			component: Input,
			props: { type: "text", allowClear: true },
		},
		{
			label: "مبلغ (ریال)",
			name: "price",
			component: Input,
			props: {
				type: "number",
				inputMode: "numeric",
				allowClear: true,
			},
		},
		{
			label: "شماره پیگیری اپراتور",
			name: "providerReferenceNumber",
			component: Input,
			props: { type: "text", allowClear: true },
		},
		{
			label: "شماره سند تراکنش اصلی",
			name: "withdrawReferenceNumber",
			component: Input,
			props: { type: "text", allowClear: true },
		},
		{
			label: "تاریخ تراکنش اصلی (از)",
			name: "startDate",
			component: DatePicker,
			props: { defaultValue: filterParams?.startDate ? toDayjs(filterParams?.startDate) : null },
		},
		{
			label: "تاریخ تراکنش اصلی (تا)",
			name: "endDate",
			component: DatePicker,
			props: { defaultValue: filterParams?.endDate ? toDayjs(filterParams?.endDate) : null },
		},
		{
			label: "تاریخ تراکنش برگشتی (از)",
			name: "reverseStartDate",
			component: DatePicker,
			props: { defaultValue: filterParams?.reverseStartDate ? toDayjs(filterParams?.reverseStartDate) : null },
		},
		{
			label: "تاریخ تراکنش برگشتی (تا)",
			name: "reverseEndDate",
			component: DatePicker,
			props: { defaultValue: filterParams?.reverseEndDate ? toDayjs(filterParams?.reverseEndDate) : null },
		},
		{
			label: "وضعیت تراکنش",
			name: "paymentStatus",
			component: Select,
			props: {
				options: paymentStatusOtions,
			},
			loading: chargeAndInernetFiltersLoading,
		},
	];

	return (
		<Collapse
			className="mt-5"
			expandIconPosition="start"
			expandIcon={({ isActive }) => (isActive ? <MinusOutlined /> : <PlusOutlined />)}
		>
			<Collapse.Panel header="جستجو در اطلاعات شارژ و بسته اینترنت" key="1">
				<Form
					layout="vertical"
					form={form}
					onFinish={onSearch}
					className={styles["merchant-search-from"]}
					initialValues={filterParams}
				>
					<Row>
						{fields.map((field) => {
							return (
								<Col xl={4} sm={4} xs={24} className={styles["input-cols"]}>
									<Form.Item label={field.label} name={field.name}>
										{field.loading ? (
											<Skeleton.Button className={styles["Skeleton-options"]} />
										) : field.component ? (
											<field.component {...field.props} />
										) : (
											""
										)}
									</Form.Item>
								</Col>
							);
						})}
					</Row>
					<Row>
						<Col xl={24} lg={24} md={24} sm={24} xs={24} className={styles["button-cols"]}>
							<Button type="primary" key="submit" htmlType="submit" className={styles["report-button"]}>
								فیلتر
							</Button>
							<Button
								onClick={onReset}
								htmlType="reset"
								type="primary"
								danger
								className={styles["report-button"]}
							>
								حذف فیلتر
							</Button>
						</Col>
					</Row>
				</Form>
			</Collapse.Panel>
		</Collapse>
	);
};

export default SearchForm;
