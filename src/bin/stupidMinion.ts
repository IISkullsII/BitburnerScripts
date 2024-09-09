import { NS, AutocompleteData } from "Bitburner";
import { ScriptArgs } from "./utils/ScriptArgs";

// const FLAGS: Flags = [['-h',1]];
// export function autocomplete(data: AutocompleteData, args: string[]) {
//     data.flags(FLAGS);
//     return;
// }

export async function main(ns:NS) {
    let scriptArg: ScriptArgs = new ScriptArgs(ns.args);
    
    if(!scriptArg.existArg('-h')) return;

    let hostname: string = scriptArg.getArgValue('-h') as string;

    let growSteps: number = scriptArg.getArgValue('-g') as number ?? 1;
    for(let i = 0; i < growSteps; i++){
        ns.grow(hostname);
    }

    let hackSteps: number = scriptArg.getArgValue('-h') as number ?? 1;
    for(let i = 0; i < growSteps; i++){
        ns.grow(hostname);
    }

    let weakenSteps: number = scriptArg.getArgValue('-w') as number ?? 1;
    for(let i = 0; i < growSteps; i++){
        ns.grow(hostname);
    }
}