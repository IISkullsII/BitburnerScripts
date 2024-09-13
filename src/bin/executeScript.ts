import { AutocompleteData, NS } from "Bitburner";
import { transferFile } from "./transferFile";
import { maxExecuteThreads } from "./maxExecuteThreads";
import { fileExists } from "./fileExists";
import { getAdminServers } from "./getAdminServer";

const FLAGS: Flags = [['script',''], ['hostname', 'home'], ['exclude', ''], ['batch', 0], ['threads', 1], ['log', false], ['noUpdate', false], ['execArgs', ""]];

export function autocomplete(data: AutocompleteData, args: string[]){
    data.flags(FLAGS);
    return [...data.scripts, ...data.servers];
}

export async function main(ns:NS) {
    const flags = ns.flags(FLAGS);

    let script = flags['script'] as string;
    let hostnames: string[] = (flags['hostname'] as string).split(",");
    let batch = flags['batch'] as number;
    let threads = flags['threads'] as number;
    let logging = flags['log'] as boolean;
    let noUpdate = flags['noUpdate'] as boolean;
    let execArgs = (flags['execArgs'] as string).split(" ");
    let exclude = (flags['exclude'] as string).split(",");

    if(hostnames[0] === "ALL") hostnames = getAdminServers(ns);

    ns.tprint(hostnames);

    hostnames.forEach(hostname => {
        if(exclude.indexOf(hostname) >= 0) return;

        let scriptExistOnHost = fileExists(ns, script, hostname);

        if(logging){
            ns.tprintf("#".repeat(32));
            ns.tprintf("");
            ns.tprintf("Executing script %s on host %s", script, hostname);
        }
    
        if(!scriptExistOnHost || !noUpdate){
            if(logging) ns.tprintf("Transferring Script to host ...");
            let res = transferFile(ns, script, hostname, 'home');
            if(!res){
                ns.tprintf("Something went wrong with transferring file '%s' to host '%s'", script, hostname);
                return;
            }
            if(logging) ns.tprintf("Transfer complete!");
        }
    
        let execThreads = threads;
        if(threads == -1){
            if(logging) ns.tprintf("Thread count is set to maximum ...");
            let maxThreads = maxExecuteThreads(ns, script, hostname);
            execThreads = maxThreads;
            if(logging) ns.tprintf("Max thread count set to: %d", maxThreads);
        }
    
        if(batch > 0){
            if(logging) ns.tprintf("Executing batches of script in threads of: %d", batch);
            executeBatchedScripts(ns, script, hostname, execThreads, batch, execArgs)
        }else{
            if(logging) ns.tprintf("Executing script '%s' on host '%s' with threads '%d'", script, hostname, execThreads);
            executeScript(ns, script, hostname, execThreads, execArgs);
        }
        if(logging) ns.tprintf("Successfully executed scripts on host!");
    
        if(logging) ns.tprintf(""); 
    });
}

export function executeBatchedScripts(ns: NS, script: string, hostname: string, threads: number, batches: number = 2, scriptArgs: string[] = []) {
    if(batches <= 0) return;
    while(threads > 0){
        let numThreads = Math.min(threads, batches);
        executeScript(ns, script, hostname, numThreads, scriptArgs);
        threads -= batches;
    }
}

export function executeScript(ns: NS, script: string, hostname: string, threads: number, scriptArgs: string[] = []){
    ns.exec(script, hostname, threads, ...scriptArgs);
}