import { AutocompleteData, NS } from "Bitburner";

const FLAGS: Flags = [['script', ''], ['hostname', 'home'], ['log', false]];

export function autocomplete(data: AutocompleteData, args: string[]){
    data.flags(FLAGS);
    return [...data.scripts, ...data.servers];
}

export async function main(ns:NS) {
    const flags = ns.flags(FLAGS);

    let script = flags['script'] as string;
    let hostname = flags['hostname'] as string;
    let logging = flags['log'] as boolean;

    let currentHost = ns.getHostname();
    let thisScriptRamNeed = scriptRamUsage(ns, ns.getScriptName(), currentHost);

    let ramUsage = scriptRamUsage(ns, script, hostname);
    let freeRam = hostFreeRam(ns, hostname);
    let maxThreads = maxExecuteThreads(ns, script, hostname);

    
    ns.tprintf("#".repeat(32));
    ns.tprintf("");

    if(hostname === currentHost){
        freeRam += thisScriptRamNeed;
        maxThreads = Math.floor(freeRam / ramUsage);
    }

    ns.tprintf("%d Threads on host '%s' of %s RAM/thread | %s / %s RAM", maxThreads, hostname, ns.formatNumber(ramUsage, 2), ns.formatNumber(ramUsage * maxThreads, 2), ns.formatNumber(freeRam, 2));

    ns.tprintf("");
}

export function maxExecuteThreads(ns: NS, script: string, hostname: string): number {

    let ramUsage = scriptRamUsage(ns, script, hostname);
    let maxRam = hostMaxRam(ns, hostname);
    let usedRam = ns.getServerUsedRam(hostname);

    let freeRam = maxRam - usedRam;

    let maxThreads = Math.floor(freeRam / ramUsage);
    
    return maxThreads;
}

export function hostMaxRam(ns: NS, hostname: string): number {
    return ns.getServerMaxRam(hostname);
}

export function hostUsedRam(ns: NS, hostname: string): number {
    return ns.getServerUsedRam(hostname);
}

export function hostFreeRam(ns: NS, hostname: string): number {
    return hostMaxRam(ns, hostname) - hostUsedRam(ns, hostname);
}

export function scriptRamUsage(ns: NS, script: string, hostname: string): number{

    let ramNeed = ns.getScriptRam(script, hostname);
    if(ramNeed <= 0) {
        ns.tprintf("Could not get ram usage of script '%s' on host '%s', most likely due to script not existing on host", script, hostname);
        return -1;
    }

    return ramNeed;
}