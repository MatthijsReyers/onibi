import { DatabaseConnector, DatabaseTransaction } from "../connector";
import mysql from 'mysql';

export class MysqlConnector implements DatabaseConnector {

    public static connectionType: string = 'MySQL';

    private config: mysql.PoolConfig;
    private connectionPool: mysql.Pool;

    constructor(config: mysql.PoolConfig) {
        this.config = config;
        this.connectionPool = mysql.createPool(config);
    }

    public query<T>(statement: string, params: any[]): T;
    public query(statement: any, params: any): any {
        throw new Error("Method not implemented.");
    }

    public async beginTransaction(): Promise<MysqlTransaction> {
        return new MysqlTransaction();
    }
}

export class MysqlTransaction implements DatabaseTransaction {
    public query<T = any>(statement: string, params: any[], timeout: number): T {
        throw new Error("Method not implemented.");
    }
    public commit(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public rollback(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public close(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public destroy(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}