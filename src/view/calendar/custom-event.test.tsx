/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { act, screen } from '@testing-library/react';

import { MemoCustomEvent } from './custom-event';
import { setupTest } from '../../carbonio-ui-commons/test/test-setup';
import { reducers } from '../../store/redux';
import mockedData from '../../test/generators';

jest.setTimeout(10000);

describe('custom-event', () => {
	test('if the event is not part of a recurrence it wont have a recurrent icon', async () => {
		const event = mockedData.getEvent();
		const invite = mockedData.getInvite({ event });
		const mockedInviteSlice = {
			invites: {
				[invite.id]: invite
			}
		};
		const emptyStore = mockedData.store.mockReduxStore({ invites: mockedInviteSlice });
		const store = configureStore({
			reducer: combineReducers(reducers),
			preloadedState: emptyStore
		});
		setupTest(<MemoCustomEvent event={event} title={event.title} />, {
			store
		});
		expect(screen.queryByTestId('icon: Repeat')).not.toBeInTheDocument();
	});
	test('if the event is part of a recurrence it will have a recurrent icon', async () => {
		const event = mockedData.getEvent({ resource: { isRecurrent: true } });
		const invite = mockedData.getInvite({ event });
		const mockedInviteSlice = {
			invites: {
				[invite.id]: invite
			}
		};
		const emptyStore = mockedData.store.mockReduxStore({ invites: mockedInviteSlice });
		const store = configureStore({
			reducer: combineReducers(reducers),
			preloadedState: emptyStore
		});
		setupTest(<MemoCustomEvent event={event} title={event.title} />, {
			store
		});
		expect(screen.getByTestId('icon: Repeat')).toBeVisible();
	});
	test('single click over the event will open the summary view', async () => {
		const event = mockedData.getEvent();
		const invite = mockedData.getInvite({ event });
		const mockedInviteSlice = {
			invites: {
				[invite.id]: invite
			}
		};
		const emptyStore = mockedData.store.mockReduxStore({ invites: mockedInviteSlice });
		const store = configureStore({
			reducer: combineReducers(reducers),
			preloadedState: emptyStore
		});
		const { user } = setupTest(<MemoCustomEvent event={event} title={event.title} />, {
			store
		});
		expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();

		await user.click(screen.getByTestId('calendar-event-inner-container'));
		act(() => {
			jest.advanceTimersByTime(250);
		});

		// this means the summary view is open
		expect(screen.getByRole('button', { name: /instance/i })).toBeInTheDocument();
	});
});
