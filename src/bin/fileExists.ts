import { AutocompleteData, NS } from "Bitburner";

const FLAGS: Flags = [['script', ''], ['hostname', 'home'], ['log', false]];

export function autocomplete(data: AutocompleteData, args: string[]) {
    data.flags(FLAGS);
    return [...data.scripts, ...data.servers];
}

export async function main(ns: NS) {
    const flags = ns.flags(FLAGS);
    const args = ns.args;

    let script = flags['script'] as string;
    let hostname = flags['hostname'] as string;
    let logging = flags['log'] as boolean;

    ns.tprintf("#".repeat(32));
    ns.tprintf("");

    let res = fileExists(ns, script, hostname);
    ns.tprintf("The script '%s' %s on host '%s'", script, res ? 'exists' : 'does not exist', hostname);

    ns.tprintf("");
}

export function fileExists(ns: NS, script: string, hostname: string): boolean {
    return ns.fileExists(script, hostname);
}