import { AutocompleteData, NS } from "Bitburner";

const FLAGS: Flags = [['src', 'home'], ['dest', 'home'], ['file', ''], ['log', true]];

export function autocomplete(data: AutocompleteData, args: string[]) {
    data.flags(FLAGS);
    return [...data.servers, ...data.scripts];
}

export async function main(ns:NS) {
    const flags = ns.flags(FLAGS);

    if(flags['file'] === ""){
        ns.tprint("ERROR: File needs to be specified via 'file' flag");
        return;
    }

    const fileName = flags['file'] as string;
    const source = flags['src'] as string;
    const destination = flags['dest'] as string;
    const logging = flags['log'] as boolean;

    if(logging){
        ns.tprintf("#".repeat(32));
        ns.tprintf("");
    }

    if(logging) ns.tprintf("Transferring '%s' from '%s' to '%s'", fileName, source, destination);
    let result: boolean = transferFile(ns, fileName, destination, source);
    if(logging) {
        if(result) {
            ns.tprintf("Transfer successful");
        }else{
            ns.tprintf("Transfer failed");
        }
    }

    if(logging) ns.tprintf("");
}

export function transferFile(ns: NS, fileName: string, destination: string, source: string): boolean {
    return ns.scp(fileName, destination, source);
}