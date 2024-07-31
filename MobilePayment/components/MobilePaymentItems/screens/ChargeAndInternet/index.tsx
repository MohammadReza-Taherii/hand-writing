import React from "react";
import ReturnButton from "components/ReturnButton";
import TableData from "./Table";
import PageTitle from "components/PageTitle";
import SearchForm from "./Form";
import {
	Pagination,
	Sorting,
	ChargeAndInternetRequest,
	ChargeAndInternetEntityParams,
	RequestData,
} from "types/mobilePayment";
import useMobilePayment from "hooks/mobilePayment.hooks";
import useTableSearchFilter from "hooks/useTableSearchFilter";

const initialPagination: Pagination = {
	page: "1",
	size: "10",
};

const initialSortedInfo: Sorting = {
	sortBy: "PAYMENT_TIME",
	order: "DESC",
};

const ChargeAndInternet: React.FC = () => {
	const { getChargeAndInternetData } = useMobilePayment();
	const [params, handleReset, handleSearch, filters, pagination, onTableChange, sortKey, orderKey] =
		useTableSearchFilter<ChargeAndInternetRequest, RequestData & ChargeAndInternetEntityParams>(
			getChargeAndInternetData,
			initialPagination,
			initialSortedInfo,
		);
	const customerId = params.get("customerId");

	return (
		<>
			<PageTitle title="شارژ و بسته اینترنت" />
			{customerId && <ReturnButton to={`/dashboard/customer/${customerId}`} />}
			<SearchForm onReset={handleReset} onSearch={handleSearch} filterParams={filters} />
			<TableData pagination={pagination} onChange={onTableChange} sortKey={sortKey} orderKey={orderKey} />
		</>
	);
};

export default ChargeAndInternet;
