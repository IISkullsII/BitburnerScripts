import { NS } from "Bitburner";

enum TASKS {
    growMoney = "Growing",
    hackMoney = "Hacking",
    weakenSecurity = "Weaken"
}

export async function main(ns: NS) {
    const args = ns.args;

    ns.disableLog("ALL");

    await ns.sleep(Math.floor(Math.random() * 1000));

    let hostname = args[0] as string ?? "PORT";
    let minMoneyPercent = args[1] as number ?? 0.75;
    let maxSecurityPercent = args[2] as number ?? 1.15;

    let currentActiveTask: TASKS = TASKS.growMoney;

    let targetPortHandle = ns.getPortHandle(1);
    let usePortTarget = hostname === "PORT";
    if(usePortTarget){
        let newTarget = targetPortHandle.peek();
        if(newTarget !== "NULL PORT DATA"){
            hostname = newTarget as string;
        }else{
            hostname = "n00dles";
        }
    }

    let maxSecurityLevel = getServerMaxSecurityLevel(ns, hostname, maxSecurityPercent);

    while(true){
        if(usePortTarget){
            let newTarget = targetPortHandle.peek();
            if(newTarget === "NULL PORT DATA"){
                newTarget = "n00dles";
            }
            if(newTarget !== hostname){
                hostname = newTarget as string;
                maxSecurityLevel = getServerMaxSecurityLevel(ns, hostname, maxSecurityPercent);
            }
        }

        ns.clearLog();
        ns.print("#==================#");
        ns.print("| Automatic Minion |");
        ns.print("#==================#");
        ns.print("");
        ns.printf("Current Target: %s", hostname);
        ns.printf("Current Task: %s", currentActiveTask as string);
        ns.printf("");
        ns.printf("LOGS -------------------------");

        switch(currentActiveTask as string){
            case "Growing": // growMoney
                currentActiveTask = await growMoney(ns, hostname, minMoneyPercent, maxSecurityLevel);
                break;
            case "Hacking": // hackMoney
                currentActiveTask = await hackMoney(ns, hostname, minMoneyPercent, maxSecurityLevel);
                break;
            case "Weaken": // weakenSecurity
            default:
                currentActiveTask = await weakenSecurity(ns, hostname, maxSecurityLevel);
                break;
        }

    }
}

function getServerMaxSecurityLevel(ns: NS, hostname: string, maxSecurityPercent: number): number {
    return ns.getServerMinSecurityLevel(hostname) * maxSecurityPercent;
}

async function growMoney(ns: NS, hostname: string, minMoneyPercent: number, maxSecurityLevel: number): Promise<TASKS> {
    let maxMoney = ns.getServerMaxMoney(hostname);
    let currentPercent = ns.getServerMoneyAvailable(hostname) / maxMoney;
    
    while(currentPercent < minMoneyPercent){
        ns.printf("Growing...");
        if(ns.getServerSecurityLevel(hostname) >= maxSecurityLevel) return TASKS.weakenSecurity;

        await ns.grow(hostname);
        currentPercent = ns.getServerMoneyAvailable(hostname) / maxMoney;
    }

    return TASKS.hackMoney;
}

async function hackMoney(ns: NS, hostname: string, minMoneyPercent: number, maxSecurityLevel: number): Promise<TASKS> {
    let minMoneyAvailable = ns.getServerMaxMoney(hostname) * minMoneyPercent;

    while(ns.getServerMoneyAvailable(hostname) >= minMoneyAvailable){
        ns.printf("Hacking...");
        if(ns.getServerSecurityLevel(hostname) >= maxSecurityLevel) return TASKS.weakenSecurity;

        await ns.hack(hostname);
    }

    return TASKS.growMoney;
}


async function weakenSecurity(ns: NS, hostname: string, maxSecurityLevel: number): Promise<TASKS> {
    let currentSecurityLevel = ns.getServerSecurityLevel(hostname);
    
    while(currentSecurityLevel >= maxSecurityLevel){
        ns.printf("Weaken...");
        await ns.weaken(hostname);
        currentSecurityLevel = ns.getServerSecurityLevel(hostname);
    }
    
    return TASKS.growMoney;
}