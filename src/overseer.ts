import { fillString } from "bin/utils/helperFuncs";
import { AutocompleteData, NS } from "Bitburner";

const FLAGS: Flags = [['hosts', ['n00dles','zer0', 'the-hub', 'computek']]];
export function autocomplete(data: AutocompleteData, args: string[]){
    data.flags(FLAGS);
    return [...data.servers];
}

export async function main(ns:NS) {
    const flags = ns.flags(FLAGS);

    ns.disableLog('ALL');
    ns.tail();

    let watchedHosts: string[] = flags['hosts'] as string[];

    let cycleChar = ["|","/","-","\\"];
    let cycleIndex = 0;

    let hostStrLength = 16;
    let secLevelStrLength = 16;
    let moneyStrLength = 16;
    let ramStrLength = 16;

    let hostStr = "Server";
    hostStr += " ".repeat(hostStrLength - hostStr.length);

    let secLevelStr = "SecLevel";
    secLevelStr += " ".repeat(secLevelStrLength - secLevelStr.length);

    let moneyStr = "Money";
    moneyStr += " ".repeat(moneyStrLength - moneyStr.length);

    let ramStr = "RAM Usage";
    ramStr += " ".repeat(ramStrLength - ramStr.length);

    let titleStr = hostStr + "| " + secLevelStr + "| " + moneyStr + "| " + ramStr;

    let watchingServers = watchedHosts.filter(host => ns.hasRootAccess(host))

    while(true){
        await ns.sleep(1000);
        ns.clearLog();

        
        ns.printf(titleStr);
        ns.printf("%s#-%s#-%s#-%s", "-".repeat(hostStrLength), "-".repeat(secLevelStrLength), "-".repeat(moneyStrLength), "-".repeat(ramStrLength));

        watchingServers.forEach(host => {
            let secLevel = ns.formatNumber(ns.getServerSecurityLevel(host), 2);
            let minSecLevel = ns.formatNumber(ns.getServerMinSecurityLevel(host), 2);
            let money = ns.formatNumber(ns.getServerMoneyAvailable(host), 2);
            let maxMoney = ns.formatNumber(ns.getServerMaxMoney(host), 2);
            let ramUsage = ns.formatNumber(ns.getServerUsedRam(host), 2);
            let maxRam = ns.formatNumber(ns.getServerMaxRam(host), 2);

            hostStr = fillString(host, hostStrLength, ".");
            secLevelStr = fillString(secLevel + "/" + minSecLevel, secLevelStrLength, "."); 
            moneyStr = fillString(money + "/" + maxMoney, moneyStrLength, ".");
            ramStr = fillString(ramUsage + "/" + maxRam, ramStrLength, ".");

            ns.printf("%s| %s| %s| %s", hostStr, secLevelStr, moneyStr, ramStr);
        });
        ns.print(cycleChar[cycleIndex]);
        cycleIndex = (cycleIndex + 1) % 4; 
    }
}