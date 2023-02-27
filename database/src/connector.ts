
/**
 * 
 */
export abstract class DatabaseConnector 
{
    /**
     * String representing SQL database type that this connector connects with.
     * For example "MySQL", "SQLite3", "PostgreSQL", reference the documentation for the specific 
     * type string it provides.
     */
    static connectionType: string;

    /**
     * Executes a query without any regard for transactions and multithreading. Only use this 
     * function for singular queries that cannot cause race conditions
     */
    public abstract query(statement: string, params: any[]): Promise<any>;

    public abstract beginTransaction(): Promise<DatabaseTransaction>;
}

/**
 * Represents a single SQL transaction made up of one or more queries.
 */
export abstract class DatabaseTransaction 
{
    /**
     * 
     * @param {string} statement - SQL statement to execute.
     * @param {any[]} params - Parameters to fill into the SQL statement.
     * @param {number} timeout - The maximum time the query may take to execute.
     */
    public abstract query(statement: string, params?: any[], timeout?: number): Promise<any>;

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