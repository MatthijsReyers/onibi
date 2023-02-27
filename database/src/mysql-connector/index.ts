import { DatabaseConnector, DatabaseTransaction } from './../connector';
import mysql from 'mysql';

export class MySqlConnector implements DatabaseConnector 
{
    static connectionType: string = "MySQL";

    private connectionPool?: mysql.Pool;

    constructor()
    {
        mysql.createPool({

        })
    }

    public query(statement: string, params: any[]): Promise<any>
    {
        return new Promise((resolve, reject) => {

        });
    }

    public beginTransaction(): Promise<DatabaseTransaction>
    {
        return new Promise((resolve, reject) => {
            return
        });
    }
}

export class MySqlTransaction implements DatabaseTransaction 
{
    private _conn: mysql.PoolConnection;

    constructor(conn: mysql.PoolConnection) 
    {
        this._conn = conn;
    }

    public query<T>(statement: string, params?: any[], timeout?: number): Promise<T> 
    {
        return new Promise<T>((resolve, reject) => {
            this._conn.query({
                sql: statement,
                values: params,
                timeout: timeout
            }, (err, res) => {
                if (err) reject(err);
                resolve(<T>res);
            })
        });
    }

    public commit(): Promise<void> 
    {
        return new Promise<void>((resolve, reject) => {
            this._conn.commit((err?: mysql.MysqlError) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    public rollback(): Promise<void> 
    {
        return new Promise<void>((resolve, reject) => {
            this._conn.rollback((err?: mysql.MysqlError) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    public close(): Promise<void> 
    {
        return new Promise<void>((resolve, reject) => {
            (<any>this._conn.end)((err?: mysql.MysqlError) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    public async destroy(): Promise<void> 
    {
        this._conn.destroy();
    }
}