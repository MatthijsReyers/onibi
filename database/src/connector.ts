
export abstract class DatabaseConnector {

    /**
     * String representing SQL database type that this connector connects with.
     * For example "MySQL", "SQLite3", "PostgreSQL", reference the documentation for the specific 
     * type string it provides.
     */
    static connectionType: string;

    /**
     * Executes a query without regard
     */
    public abstract query<T>(statement: string, params: any[]): T;
    public abstract query(statement: string, params: any[]): any;

    public abstract beginTransaction(): Promise<DatabaseTransaction>;
}

/**
 * Represents a single transaction.
 */
export abstract class DatabaseTransaction {

    /**
     * 
     * @param statement 
     * @param params 
     * @param timeout
     */
    public abstract query<T = any>(statement: string, params: any[], timeout: number): T;

    /** 
     * Commits the given transaction to the database.
     */
    public abstract commit(): Promise<void>;

    /** 
     * Rollback the given transaction.
     */
    public abstract rollback(): Promise<void>;

    /**
     * Closes the connection. Any queued data (eg queries) will be sent first. If there are any 
     * fatal errors, the connection will be immediately closed.
     */
    public abstract close(): Promise<void>;

    /**
     * Close the connection immediately, without waiting for any queued data (eg * queries) to
     * be sent. No further events or callbacks will be triggered.
     */
    public abstract destroy(): Promise<void>;

}