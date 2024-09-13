import { AutocompleteData, NS } from "Bitburner";

const FLAGS: Flags = [['script', 'ALL'], ['hostname', 'home'], ['log', false]];

export function autocomplete(data: AutocompleteData, args: string[]){
    data.flags(FLAGS);
    return [...data.scripts, ...data.servers, 'ALL'];
}

export async function main(ns:NS) {
    const flags = ns.flags(FLAGS);

    let script = flags['script'] as string;
    let hostname = flags['hostname'] as string;
    let logging = flags['log'] as boolean;

    if(logging){
        ns.tprintf("#".repeat(32));
        ns.tprintf("");
    }

    if(script === "ALL"){
        if(logging) ns.tprintf("Killing all scripts on host '%s'", hostname);
        killAllScripts(ns, hostname);
    }else{
        if(logging) ns.tprint("Killing all '%s' on host '%s'", script, hostname);
        let res = killScript(ns, script, hostname);
        if(logging) {
            if(res){
                ns.tprint("One or more Scripts were killed");
            }else{
                ns.tprintf("There was no running instance of script '%s' on host '%s'", script, hostname);
            }
        }
    }

    if(logging) ns.tprintf("");
}

export function killScript(ns: NS, script: string, hostname: string): boolean {
    return ns.scriptKill(script, hostname);
}

export function killAllScripts(ns: NS, hostname: string) {
    return ns.killall(hostname, true);
}