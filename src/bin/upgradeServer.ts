import { AutocompleteData, NS } from "Bitburner";

const FLAGS: Flags = [['hostname', ''], ['size', 'MAX'], ['log', false]];

export function autocomplete(data: AutocompleteData, args: string[]){
    data.flags(FLAGS);
    return [...data.servers];
}

export async function main(ns: NS) {
    
}