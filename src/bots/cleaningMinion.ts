import { NS, AutocompleteData } from "Bitburner";

export function autocomplete(data: AutocompleteData, args: string[]){
    return [...data.servers];
}

export async function main(ns:NS) {
    let hostname: string = ns.args[0] as string ?? 'PORT';

    let targetPortHandle = ns.getPortHandle(2);
    let usePortTarget = hostname === "PORT";
    

    while(true){
        if(usePortTarget){
            let newTarget = targetPortHandle.peek();
            if(newTarget !== "NULL PORT DATA") hostname = newTarget as string;
        }

        await ns.weaken(hostname);
    }
}