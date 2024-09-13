import { NS, AutocompleteData } from "Bitburner";

export function autocomplete(data: AutocompleteData, args: string[]){
    return [...data.servers];
}

export async function main(ns:NS) {
    let hostname: string = ns.args[0] as string ?? 'PORT';

    let targetPortHandle = ns.getPortHandle(1);
    let usePortTarget = hostname === "PORT";
    

    let growSteps: number = ns.args[1] as number ?? 1;
    let hackSteps: number = ns.args[2] as number ?? 1;
    let weakenSteps: number = ns.args[3] as number ?? 1;
    

    while(true){
        if(usePortTarget){
            let newTarget = targetPortHandle.peek();
            if(newTarget !== "NULL PORT DATA") hostname = newTarget as string;
        }

        for(let i = 0; i < growSteps; i++){
            await ns.grow(hostname);
        }
    
        for(let i = 0; i < hackSteps; i++){
            await ns.hack(hostname);
        }
    
        for(let i = 0; i < weakenSteps; i++){
            await ns.weaken(hostname);
        }
    }
}