import { ECityName, IPlayer } from 'Bitburner';
import { HP } from './HP';
import { Skills } from './Skills';
import { Multipliers } from './Multipliers';

export class Player implements IPlayer {
    money: number = 0;
    numPeopleKilled: number = 0;
    entropy: number = 0;
    jobs: Record<string, string> = {};
    factions: string[] = [];
    totalPlaytime: number = 0;
    location: string = "";
    hp: HP = new HP();
    skills: Skills = new Skills();
    exp: Skills = new Skills();
    mults: Multipliers = new Multipliers;
    city: ECityName = ECityName.Aevum;

}