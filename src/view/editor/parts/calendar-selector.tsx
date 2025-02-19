/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { ReactElement, useCallback, useMemo } from 'react';

import { Select } from '@zextras/carbonio-design-system';
import { FOLDERS, LinkFolder, ROOT_NAME, useUserSettings } from '@zextras/carbonio-shell-ui';
import { filter, find, map, reject } from 'lodash';
import { useTranslation } from 'react-i18next';

import LabelFactory, { ItemFactory } from './select-label-factory';
import {
	getRootAccountId,
	useFoldersMap,
	useFoldersMapByRoot
} from '../../../carbonio-ui-commons/store/zustand/folder';
import { isTrashOrNestedInIt } from '../../../carbonio-ui-commons/store/zustand/folder/utils';
import { Folder } from '../../../carbonio-ui-commons/types/folder';
import { hasId } from '../../../carbonio-ui-commons/worker/handle-message';
import { PREFS_DEFAULTS } from '../../../constants';
import {
	setCalendarColor,
	setCalendarColorFromNumber
} from '../../../normalizations/normalizations-utils';

type CalendarSelectorProps = {
	calendarId: string;
	onCalendarChange: (calendar: Folder) => void;
	label?: string;
	excludeTrash?: boolean;
	showCalWithWritePerm?: boolean;
	disabled?: boolean;
};

export const CalendarSelector = ({
	calendarId,
	onCalendarChange,
	label,
	excludeTrash = false,
	showCalWithWritePerm = true,
	disabled
}: CalendarSelectorProps): ReactElement | null => {
	const [t] = useTranslation();
	const rootAccountId = getRootAccountId(calendarId);

	const allCalendarsByRoot = useFoldersMapByRoot(rootAccountId ?? FOLDERS.USER_ROOT);
	const allCalendars = useFoldersMap();

	const calendars = reject(
		rootAccountId?.includes(':') ? allCalendarsByRoot : allCalendars,
		(item) => item.name === ROOT_NAME || (item as LinkFolder).oname === ROOT_NAME
	);

	const { zimbraPrefDefaultCalendarId } = useUserSettings().prefs;

	const calWithWritePerm = useMemo(
		() =>
			showCalWithWritePerm
				? filter(calendars, (calendar) =>
						calendar.perm ? /w/.test(calendar.perm) : !(calendar as LinkFolder).owner
					)
				: calendars,
		[calendars, showCalWithWritePerm]
	);

	const requiredCalendars = useMemo(
		() =>
			excludeTrash
				? filter(calWithWritePerm, (cal) => !isTrashOrNestedInIt(cal))
				: calWithWritePerm,
		[calWithWritePerm, excludeTrash]
	);
	const calendarItems = useMemo(
		() =>
			map(requiredCalendars, (cal) => {
				const color = setCalendarColor({ color: cal.color, rgb: cal.rgb });
				const labelName = hasId(cal, FOLDERS.CALENDAR) ? t('label.calendar', 'Calendar') : cal.name;
				return {
					...cal,
					label: labelName,
					value: cal.id,
					color: color.color,
					customComponent: (
						<ItemFactory
							disabled={disabled ?? false}
							absFolderPath={cal.absFolderPath}
							color={color.color}
							isLink={cal.isLink}
							label={labelName}
							acl={cal.acl}
							id={cal.id}
						/>
					)
				};
			}),
		[disabled, requiredCalendars, t]
	);

	const defaultCalendarSelection = useMemo(() => {
		const defaultCal = find(requiredCalendars, [
			'id',
			zimbraPrefDefaultCalendarId ?? PREFS_DEFAULTS?.DEFAULT_CALENDAR_ID
		]);
		const defaultCalendar = {
			id: requiredCalendars?.[0]?.id ?? defaultCal?.id,
			acl: requiredCalendars?.[0]?.acl ?? defaultCal?.acl,
			isLink: requiredCalendars?.[0]?.isLink ?? defaultCal?.isLink,
			absFolderPath: requiredCalendars?.[0]?.absFolderPath ?? defaultCal?.absFolderPath,
			value: requiredCalendars?.[0]?.id ?? defaultCal?.id,
			label: requiredCalendars?.[0]?.name ?? defaultCal?.name,
			color: requiredCalendars?.[0]?.color
				? setCalendarColorFromNumber(requiredCalendars?.[0]?.color).color
				: defaultCal?.color
		};
		return find(calendarItems, ['value', calendarId]) ?? defaultCalendar;
	}, [requiredCalendars, zimbraPrefDefaultCalendarId, calendarItems, calendarId]);

	const onSelectedCalendarChange = useCallback(
		(id) => {
			const calendar = find(calendars, ['id', id]) ?? requiredCalendars[0];
			return onCalendarChange(calendar);
		},
		[calendars, onCalendarChange, requiredCalendars]
	);

	return calendars && defaultCalendarSelection ? (
		<Select
			label={label || t('label.calendar', 'Calendar')}
			onChange={onSelectedCalendarChange}
			items={calendarItems}
			maxWidth={'fill'}
			defaultSelection={defaultCalendarSelection}
			disablePortal
			disabled={disabled}
			LabelFactory={LabelFactory}
			background="white"
			style={{ border: '1px solid lightgray' }}
		/>
	) : null;
};
