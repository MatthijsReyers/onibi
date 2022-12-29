import '../../database/src/connector';
import { DatabaseConnection } from '@onibi/database';
import mysql from 'mysql';

export class MySqlConnection implements DatabaseConnection {

    private _conn: mysql.PoolConnection;

    constructor(conn: mysql.PoolConnection) {
        this._conn = conn;
    }

    public async query<Type = void>(statement: string, params: any[] = []): Promise<Type> {
        return new Promise<Type>((resolve, reject) => {
            this._conn.query(statement, params, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        });
    }

    /**
     * Close the connection. Any queued data (eg queries) will be sent first. If
     * there are any fatal errors, the connection will be immediately closed.
     * @param callback Handler for any fatal error
     */
    public end(): void {
        this._conn.end();
    }

    /**
     * Close the connection immediately, without waiting for any queued data (eg
     * queries) to be sent. No further events or callbacks will be triggered.
     */
    public destroy(): void {
        this._conn.destroy();
    }
}