/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, ReactElement, useCallback, useMemo } from 'react';

import {
	Container,
	Button,
	IconButton,
	ButtonProps,
	pseudoClasses,
	Tooltip,
	Padding
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import styled, { css, SimpleInterpolation } from 'styled-components';

import { useAppStatusStore } from '../../store/zustand/store';
import {
	BACKGROUND_HEADER_COLOR,
	BUTTONCOLOR,
	FOREGROUND_COLOR,
	PRIMARY_ICON_COLOR_ACTIVE
} from '../../sruvi/Colors';
import Desktop from '../../sruvi/Desktop';
import VeryLarge from '../../sruvi/VeryLarge';
import Mobile from '../../sruvi/Mobile';
import { Paper } from '@mui/material';

const ButtonWrapper = styled.div`
	min-width: fit-content;
	border: 0.0625rem solid;
	${({ color = 'primary', theme }): SimpleInterpolation => css`
		${pseudoClasses(theme, color, 'border-color')};
	`};
	&:last-child {
		border-left: none;
		border-radius: 0 0.125rem 0.125rem 0;
	}
	&:first-child {
		border-right: none;
		border-radius: 0.125rem 0 0 0.125rem;
	}
	&:not(:first-child):not(:last-child) {
		border-radius: 0;
		border-right: none;
		border-left: none;
	}
`;

const CustomButton: FC<ButtonProps> = (props: ButtonProps): ReactElement => (
	<ButtonWrapper>
		<Button {...props} color={BUTTONCOLOR} style={{ border: 0 }} />
	</ButtonWrapper>
);

export interface CustomToolbarProps {
	label: string;
	onView: (arg: string) => void;
	onNavigate: (arg: string) => void;
	view: string;
}

export const CustomToolbar = ({
	label,
	onView,
	onNavigate,
	view
}: CustomToolbarProps): ReactElement => {
	const [t] = useTranslation();
	const today = useCallback(() => onNavigate('TODAY'), [onNavigate]);
	const next = useCallback(() => onNavigate('NEXT'), [onNavigate]);
	const prev = useCallback(() => onNavigate('PREV'), [onNavigate]);
	const week = useCallback(() => {
		useAppStatusStore.setState({ calendarView: 'week' });
		return onView('week');
	}, [onView]);
	const day = useCallback(() => {
		useAppStatusStore.setState({ calendarView: 'day' });
		return onView('day');
	}, [onView]);
	const month = useCallback(() => {
		useAppStatusStore.setState({ calendarView: 'month' });
		return onView('month');
	}, [onView]);
	const workView = useCallback(() => {
		useAppStatusStore.setState({ calendarView: 'work_week' });
		return onView('work_week');
	}, [onView]);

	const leftClickLabel = useMemo(() => {
		if (view === 'month') {
			return t('previous_month', 'Previous month');
		}
		if (view === 'week' || view === 'work_week') {
			return t('previous_week', 'Previous week');
		}
		return t('previous_day', 'Previous day');
	}, [t, view]);

	const rightClickLabel = useMemo(() => {
		if (view === 'month') {
			return t('next_month', 'Next month');
		}
		if (view === 'week' || view === 'work_week') {
			return t('next_week', 'Next week');
		}
		return t('next_day', 'Next day');
	}, [t, view]);

	return (
		// <Container width="fill" height="fit" padding={{ bottom: 'small' }}>
		// 	<Container
		// 		data-testid="CalendarToolbar"
		// 		orientation="horizontal"
		// 		width="fill"
		// 		height="3rem"
		// 		mainAlignment="flex-start"
		// 		background={BACKGROUND_HEADER_COLOR}
		// 		padding={{ horizontal: 'small' }}
		// 	>

		<div style={{ width: '100%' }}>
			<Desktop>
				<div style={{ padding: '16px' }}>
					<div
						style={{
							display: 'flex',
							width: '100%',
							height: '100%',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<div>
							<Button
								color={BUTTONCOLOR}
								label={t('label.today', 'today')}
								type="outlined"
								onClick={today}
								minWidth={'fit-content'}
							/>
						</div>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<Tooltip label={leftClickLabel}>
								<IconButton
									iconColor={PRIMARY_ICON_COLOR_ACTIVE}
									icon="ChevronLeft"
									onClick={prev}
									minWidth={'max-content'}
								/>
							</Tooltip>
							<Tooltip label={rightClickLabel}>
								<IconButton
									iconColor={PRIMARY_ICON_COLOR_ACTIVE}
									icon="ChevronRight"
									onClick={next}
									minWidth={'max-content'}
								/>
							</Tooltip>
						</div>
						<div>
							<Button
								color={BUTTONCOLOR}
								type="ghost"
								label={label}
								onClick={(): null => null}
								data-testid="CurrentDateContainer"
							/>
						</div>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<CustomButton
								backgroundColor={view === 'month' ? FOREGROUND_COLOR : undefined}
								label={t('label.month', 'month')}
								type="outlined"
								onClick={month}
								data-testid="MonthButton"
							/>
							<CustomButton
								backgroundColor={view === 'week' ? FOREGROUND_COLOR : undefined}
								label={t('label.week', 'week')}
								type="outlined"
								onClick={week}
								data-testid="WeekButton"
							/>
							<CustomButton
								backgroundColor={view === 'day' ? FOREGROUND_COLOR : undefined}
								label={t('label.day', 'day')}
								type="outlined"
								onClick={day}
								data-testid="DayButton"
							/>
							<CustomButton
								backgroundColor={view === 'work_week' ? FOREGROUND_COLOR : undefined}
								label={t('label.work_week', 'work week')}
								type="outlined"
								onClick={workView}
								data-testid="WorkWeekButton"
							/>
						</div>
					</div>
				</div>
			</Desktop>
			<VeryLarge>
				<div style={{ padding: '16px' }}>
					<div
						style={{
							display: 'flex',
							width: '100%',
							height: '100%',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<div>
							<Button
								color={BUTTONCOLOR}
								label={t('label.today', 'today')}
								type="outlined"
								onClick={today}
								minWidth={'fit-content'}
							/>
						</div>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<Tooltip label={leftClickLabel}>
								<IconButton
									iconColor={PRIMARY_ICON_COLOR_ACTIVE}
									icon="ChevronLeft"
									onClick={prev}
									minWidth={'max-content'}
								/>
							</Tooltip>
							<Tooltip label={rightClickLabel}>
								<IconButton
									iconColor={PRIMARY_ICON_COLOR_ACTIVE}
									icon="ChevronRight"
									onClick={next}
									minWidth={'max-content'}
								/>
							</Tooltip>
						</div>
						<div>
							<Button
								type="ghost"
								label={label}
								onClick={(): null => null}
								data-testid="CurrentDateContainer"
							/>
						</div>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<CustomButton
								backgroundColor={view === 'month' ? FOREGROUND_COLOR : undefined}
								label={t('label.month', 'month')}
								type="outlined"
								onClick={month}
								data-testid="MonthButton"
							/>
							<CustomButton
								backgroundColor={view === 'week' ? FOREGROUND_COLOR : undefined}
								label={t('label.week', 'week')}
								type="outlined"
								onClick={week}
								data-testid="WeekButton"
							/>
							<CustomButton
								backgroundColor={view === 'day' ? FOREGROUND_COLOR : undefined}
								label={t('label.day', 'day')}
								type="outlined"
								onClick={day}
								data-testid="DayButton"
							/>
							<CustomButton
								backgroundColor={view === 'work_week' ? FOREGROUND_COLOR : undefined}
								label={t('label.work_week', 'work week')}
								type="outlined"
								onClick={workView}
								data-testid="WorkWeekButton"
							/>
						</div>
					</div>
				</div>
			</VeryLarge>
			<Mobile>
				<Paper variant="outlined">
					<div style={{ padding: '8px' }}>
						<div
							style={{
								display: 'flex',
								width: '100%',
								height: '100%',
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center'
							}}
						>
							<div>
								<Button
									color={BUTTONCOLOR}
									label={t('label.today', 'today')}
									type="outlined"
									onClick={today}
									minWidth={'fit-content'}
								/>
							</div>
							<div style={{ display: 'flex', flexDirection: 'row' }}>
								<Tooltip label={leftClickLabel}>
									<IconButton
										iconColor={PRIMARY_ICON_COLOR_ACTIVE}
										icon="ChevronLeft"
										onClick={prev}
										minWidth={'max-content'}
									/>
								</Tooltip>
								<Tooltip label={rightClickLabel}>
									<IconButton
										iconColor={PRIMARY_ICON_COLOR_ACTIVE}
										icon="ChevronRight"
										onClick={next}
										minWidth={'max-content'}
									/>
								</Tooltip>
							</div>
							<div>
								<Button
									color={BUTTONCOLOR}
									type="ghost"
									label={label}
									onClick={(): null => null}
									data-testid="CurrentDateContainer"
								/>
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								marginTop: '8px',
								justifyContent: 'center',
								width: '100%'
							}}
						>
							<CustomButton
								backgroundColor={view === 'month' ? FOREGROUND_COLOR : undefined}
								label={t('label.month', 'month')}
								type="outlined"
								onClick={month}
								data-testid="MonthButton"
							/>
							<CustomButton
								backgroundColor={view === 'week' ? FOREGROUND_COLOR : undefined}
								label={t('label.week', 'week')}
								type="outlined"
								onClick={week}
								data-testid="WeekButton"
							/>
							<CustomButton
								backgroundColor={view === 'day' ? FOREGROUND_COLOR : undefined}
								label={t('label.day', 'day')}
								type="outlined"
								onClick={day}
								data-testid="DayButton"
							/>
							<CustomButton
								backgroundColor={view === 'work_week' ? FOREGROUND_COLOR : undefined}
								label={t('label.work_week', 'work week')}
								type="outlined"
								onClick={workView}
								data-testid="WorkWeekButton"
							/>
						</div>
					</div>
				</Paper>
			</Mobile>
		</div>
	);
};
{
	/* <Container width="max-content" orientation="horizontal" mainAlignment="flex-start">
					<Button
						label={t('label.today', 'today')}
						type="outlined"
						onClick={today}
						minWidth={'fit-content'}
					/>
					<Padding left={'1rem'} />
					<Tooltip label={leftClickLabel}>
						<IconButton
							iconColor="primary"
							icon="ChevronLeft"
							onClick={prev}
							minWidth={'max-content'}
						/>
					</Tooltip>
					<Padding horizontal={'.25rem'} />
					<Tooltip label={rightClickLabel}>
						<IconButton
							iconColor="primary"
							icon="ChevronRight"
							onClick={next}
							minWidth={'max-content'}
						/>
					</Tooltip>
				</Container>
				<Container
					orientation="horizontal"
					mainAlignment="flex-start"
					style={{ minWidth: 0, flexBasis: 'content', flexGrow: 1 }}
				>
					<Padding left={'1rem'} />
					<Button
						type="ghost"
						label={label}
						onClick={(): null => null}
						data-testid="CurrentDateContainer"
					/>
				</Container>
				<Container width="fit" orientation="horizontal" mainAlignment="flex-end">
					<CustomButton
						backgroundColor={view === 'month' ? 'highlight' : undefined}
						label={t('label.month', 'month')}
						type="outlined"
						onClick={month}
						data-testid="MonthButton"
					/>
					<CustomButton
						backgroundColor={view === 'week' ? 'highlight' : undefined}
						label={t('label.week', 'week')}
						type="outlined"
						onClick={week}
						data-testid="WeekButton"
					/>
					<CustomButton
						backgroundColor={view === 'day' ? 'highlight' : undefined}
						label={t('label.day', 'day')}
						type="outlined"
						onClick={day}
						data-testid="DayButton"
					/>
					<CustomButton
						backgroundColor={view === 'work_week' ? 'highlight' : undefined}
						label={t('label.work_week', 'work week')}
						type="outlined"
						onClick={workView}
						data-testid="WorkWeekButton"
					/>
				</Container>
		// 	</Container>
		// </Container> */
}
