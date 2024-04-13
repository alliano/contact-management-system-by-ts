import winston, { Logger } from "winston";
export class Winston {
    private static logger?: Logger;
    public static getLogger(): Logger {
        if(this.logger == undefined || this.logger == null) {
            return winston.createLogger({
                level: "debug",
                format: winston.format.json(),
                transports: [
                    new winston.transports.Console({})
                ]
            })
        }
        else {        
            return this.logger;

        }
    }
}