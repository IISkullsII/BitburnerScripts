import { AutocompleteData, NS } from "Bitburner";

export async function main(ns: NS) {
    const args = ns.args;

    let port = args[0] as number;
    let data = args[1] as string|number;

    let portHandle = ns.getPortHandle(port);
    portHandle.clear()
    portHandle.write(data);

    ns.tprintf("Written '%s' to port '%d'", data, port);
}