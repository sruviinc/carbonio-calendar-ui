/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import {
	Container,
	Padding,
	Text,
	Button,
	Row,
	Divider,
	Checkbox
} from '@zextras/carbonio-design-system';
import { t } from '@zextras/carbonio-shell-ui';
import { map } from 'lodash';

import TimePicker from './components/time-picker';
import { getWeekDay } from './components/utils';
import { Paper } from '@mui/material';
import { BUTTONCOLOR } from '../sruvi/Colors';

export default function WorkWeekSettings({
	workingSchedule,
	isRegular,
	handelDaysClicked,
	setIsRegular,
	calculateRegularSchedule,
	toggleModal
}) {
	return (
		<div style={{ width: '100%' }}>
			<Container padding={{ all: 'medium' }} mainAlignment="baseline" crossAlignment="baseline">
				{map(workingSchedule, (s, index) => (
					<Row key={`week_day_${index}`}>
						<Checkbox
							value={s.working}
							onClick={handelDaysClicked(s.day)}
							label={getWeekDay(`${Number(s.day) - 1}`)}
						/>
					</Row>
				))}

				<Row padding={{ all: 'small' }}>
					<Text size="large" weight="bold">
						{t('label.work_hour', 'Work hour')}
					</Text>
				</Row>
				<Row>
					<Checkbox
						value={isRegular}
						onClick={() => setIsRegular(!isRegular)}
						label={t('label.regular', 'Regular')}
					/>
				</Row>
				<Row
					padding={{ all: 'small' }}
					mainAlignment="space-between"
					crossAlignment="baseline"
					orientation="horizontal"
					width="100%"
				>
					<TimePicker
						start={workingSchedule[1]?.start}
						disabled={!isRegular}
						end={workingSchedule[1]?.end}
						onChange={calculateRegularSchedule}
						day="1"
					/>
				</Row>

				<Row>
					<Checkbox
						value={!isRegular}
						onClick={() => setIsRegular(!isRegular)}
						label={t('label.custom', 'Custom')}
					/>
				</Row>
				<Row width="100%" padding={{ all: 'small' }}>
					<Button
						width="fill"
						type="outlined"
						label={t('button.customize_modal', 'Open Customize Modal')}
						color={BUTTONCOLOR}
						disabled={isRegular}
						onClick={toggleModal}
					/>
				</Row>
				<Row orientation="vertical" mainAlignment="flex-start" crossAlignment="flex-start">
					<Text>
						{t('label.timezone_pref_msg', 'The timings follow your timezone preferences.')}
					</Text>
					<Text>
						<i>{t('label.your_pref_timezone_msg', '')}</i>
					</Text>
				</Row>
				<Padding vertical="small" />
			</Container>
		</div>
	);
}
