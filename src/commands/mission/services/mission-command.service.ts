import { ChatInputCommandInteraction, Client } from 'discord.js';
import { isNil } from 'lodash';
import { ICommand } from '../../../common/interfaces/command.interface';
import { CommandOptionsUtils } from '../../../common/utils/command-options.utils';
import { MissionOptions } from '../enums/mission-option.enum';
import { MissionDisabledCommandService } from './mission-disabled.service';
import { EnabledMissionCommandService } from './mission-enabled-command.service';
import { MissionListCommandService } from './mission-list-command.service';
import { UpdateMissionCommandService } from './update-mission-command.service';

export class MissionCommandService implements ICommand {
	constructor(
		private readonly client: Client,
		private readonly interaction: ChatInputCommandInteraction,
		private readonly enabledMissionCommandService: EnabledMissionCommandService = new EnabledMissionCommandService(
			client,
			interaction
		),
		private readonly missionListCommandService: MissionListCommandService = new MissionListCommandService(
			client,
			interaction
		),
		private readonly missionDisabledCommandService: MissionDisabledCommandService = new MissionDisabledCommandService(
			client,
			interaction
		),
		private readonly updateMissionCommandService: UpdateMissionCommandService = new UpdateMissionCommandService(
			client,
			interaction
		)
	) {}

	public async execute(): Promise<void> {
		const isEnabled = CommandOptionsUtils.getNotRequired(this.interaction, MissionOptions.ENABLED);
		const isMissionList = !isNil(CommandOptionsUtils.getNotRequired(this.interaction, MissionOptions.LIST));
		const isDisabled = !isNil(CommandOptionsUtils.getNotRequired(this.interaction, MissionOptions.DISABLED));
		const isToUpdate = !isNil(CommandOptionsUtils.getNotRequired(this.interaction, MissionOptions.UPDATE));

		if (isMissionList) {
			return await this.missionListCommandService.execute();
		} else if (isDisabled) {
			return await this.missionDisabledCommandService.execute();
		} else if (isEnabled?.options) {
			return await this.enabledMissionCommandService.execute(isEnabled.options as any);
		} else if (isToUpdate) {
			return await this.updateMissionCommandService.execute();
		}
	}
}
