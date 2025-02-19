/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { ReactComponentElement } from 'react';

import { Container, List, Row, Text, Padding } from '@zextras/carbonio-design-system';
import { t } from '@zextras/carbonio-shell-ui';
import { sortBy } from 'lodash';
import moment from 'moment';
import { useParams } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { AdvancedFilterButton } from './parts/advanced-filter-button';
import SearchListItem from './search-list-item';
import ShimmerList from './shimmer-list';
import { BACKGROUND_COLOR } from '../../sruvi/Colors';

type SearchListProps = {
	appointments: Array<any>;
	loadMore: () => any;
	loading: boolean;
	searchDisabled: boolean;
	filterCount: number;
	setShowAdvanceFilters: (show: boolean) => void;
	dateStart: number;
	dateEnd: number;
};

export type RoutesParams = {
	action: 'view' | 'edit';
	apptId: string;
	ridZ: string;
};

const SearchList = ({
	appointments,
	loadMore,
	loading,
	searchDisabled,
	filterCount,
	setShowAdvanceFilters,
	dateStart,
	dateEnd
}: SearchListProps): ReactComponentElement<any> => {
	const { apptId, ridZ } = useParams<RoutesParams>();

	return (
		<Container
			background={BACKGROUND_COLOR}
			width="30%"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			data-testid="CalendarsSearchResultListContainer"
		>
			<Row
				padding={{ horizontal: 'small', top: 'medium', bottom: 'small' }}
				orientation="horizontal"
				mainAlignment="flex-start"
			>
				<Text size="medium" color="secondary">
					{t('search.from_date', 'From')} {moment(dateStart).format('DD/MM/YYYY')}
				</Text>
				<Padding left="small" />
				<Text size="medium" color="secondary">
					{t('search.to_date', 'to')} {moment(dateEnd).format('DD/MM/YYYY')}
				</Text>
			</Row>
			<AdvancedFilterButton
				setShowAdvanceFilters={setShowAdvanceFilters}
				filterCount={filterCount}
				searchDisabled={searchDisabled}
			/>
			{loading ? (
				<ShimmerList />
			) : (
				<List
					items={sortBy(appointments ?? [], ['start'])}
					ItemComponent={SearchListItem}
					active={`${apptId}:${ridZ}`}
					onListBottom={loadMore}
					background="gray6"
					data-testid="SearchResultCalendarsContainer"
				/>
			)}
		</Container>
	);
};

export default SearchList;
