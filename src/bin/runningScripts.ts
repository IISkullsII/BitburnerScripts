import { AutocompleteData, NS, ProcessInfo } from "Bitburner";
import { fillString } from "./utils/helperFuncs";

const FLAGS: Flags = [['script', ''], ['hostname', 'home'], ['log', false]];

export function autocomplete(data: AutocompleteData, args: string[]){
    data.flags(FLAGS);
    return [...data.scripts, ...data.servers];
}

export async function main(ns:NS) {
    const flags = ns.flags(FLAGS);

    let script = flags['script'] as string;
    let hostname = flags['hostname'] as string;
    let logging = flags['log'] as string;

    let processes: ProcessInfo[] = getAllRunningScripts(ns, hostname);
    let ownScriptName = ns.getScriptName();

    let scriptProcesses = {};
    processes.forEach(process => {
        let argsStr = process.args.join(" ");
        if(argsStr === "") argsStr = "no args";
        let scriptStr = process.filename;
        if(scriptStr.indexOf(ownScriptName) >= 0) return;
        
        if(scriptProcesses[scriptStr] == undefined) scriptProcesses[scriptStr] = {};
        if(scriptProcesses[scriptStr][argsStr] == undefined){
            scriptProcesses[scriptStr][argsStr] = process.threads;
        }else{
            scriptProcesses[scriptStr][argsStr] += process.threads;
        }
    })

    ns.tprintf("#".repeat(32));
    ns.tprintf("");
    ns.tprintf(fillString("List of all running Scripts on host: '" + hostname + "' ", 67, "="));
    ns.tprintf("");

    Object.keys(scriptProcesses).forEach(processKey => {
        ns.tprintf("%s | %s", fillString(processKey + " ", 32, "="), fillString("Total threads ", 32, "="));
        Object.keys(scriptProcesses[processKey]).forEach(argsKey => {
            ns.tprintf("  %s | %d", fillString("[" + argsKey + "]", 30, " "), scriptProcesses[processKey][argsKey]);
        })
    });

    ns.tprintf("");
}

export function getAllRunningScripts(ns: NS, hostname: string): ProcessInfo[] {
    let res = ns.ps(hostname);
    return res;
}