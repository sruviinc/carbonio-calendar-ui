/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useCallback, useRef } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Container } from '@mui/material';
import { useLocalStorage } from '@zextras/carbonio-shell-ui';

import { theme } from '../../theme/theme-mui';
import type { Folder } from '../../types/folder';
import type { SidebarAccordionProps } from '../../types/sidebar';
import { hasId } from '../../worker/handle-message';
import { FOREGROUND_COLOR } from '../../../sruvi/Colors';

export const SidebarAccordionMui: FC<SidebarAccordionProps> = ({
	accordions,
	folderId,
	localStorageName,
	AccordionCustomComponent,
	setSelectedFolder,
	buttonFindShares,
	initialExpanded
}) => {
	const [openIds, setOpenIds] = useLocalStorage<Array<string>>(
		localStorageName,
		initialExpanded ?? []
	);
	const sidebarRef = useRef<HTMLInputElement>(null);
	const onClick = useCallback(
		({ accordion, expanded }: { accordion: Folder; expanded: boolean }): void => {
			if (expanded) {
				setOpenIds((state: Array<string>) =>
					state.includes(accordion.id) ? state : [...state, accordion.id]
				);
			} else {
				setOpenIds((state: Array<string>) => state.filter((id) => id !== accordion.id));
			}
		},
		[setOpenIds]
	);

	return (
		<Container ref={sidebarRef} disableGutters>
			{accordions.map((accordion) =>
				accordion.id === 'find_shares' ? (
					buttonFindShares
				) : (
					<Accordion
						disableGutters
						TransitionProps={{ unmountOnExit: true }}
						expanded={openIds.includes(accordion.id)}
						key={accordion.id}
					>
						<AccordionSummary
							onClick={(): void => {
								setSelectedFolder && setSelectedFolder(accordion.id);
							}}
							expandIcon={
								accordion?.children?.length > 0 &&
								!hasId(accordion, 'all') && (
									<ExpandMoreIcon
										color="primary"
										onClick={(e): void => {
											e.preventDefault();
											onClick({ accordion, expanded: !openIds.includes(accordion.id) });
										}}
									/>
								)
							}
							aria-controls="panel1a-content"
							id={accordion.id}
							sx={{
								backgroundColor: accordion.id === folderId ? FOREGROUND_COLOR : 'transparent',
								'&:hover': {
									backgroundColor:
										accordion.id === folderId ? FOREGROUND_COLOR : theme.palette.gray5.hover
								},
								borderRadius: '16px'
							}}
						>
							<AccordionCustomComponent item={accordion} />
						</AccordionSummary>
						{accordion?.children?.length > 0 && (
							<AccordionDetails>
								<SidebarAccordionMui
									accordions={accordion.children}
									folderId={folderId}
									key={accordion.id}
									localStorageName={localStorageName}
									AccordionCustomComponent={AccordionCustomComponent}
									setSelectedFolder={setSelectedFolder}
									buttonFindShares={buttonFindShares}
									initialExpanded={initialExpanded}
								/>
							</AccordionDetails>
						)}
					</Accordion>
				)
			)}
		</Container>
	);
};
