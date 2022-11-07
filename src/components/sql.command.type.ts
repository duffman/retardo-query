/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-10-17 14:31
 */

export enum SqlCmdType {
	Select = "SELECT", // Extracts data from a database
	Update = "UPDATE", 		// updates data in a database
	DELETE = "DELETE",		// Deletes data from a database
	InsertInto = "INSERT INTO",	// Inserts new data into a database

	/*
	CreateDatabase = "CREATE DATABASE", // Creates a new database
	AlterDatabase = "ALTER DATABASE", // Modifies a database
	CREATE TABLE = "CREATE TABLE", - creates a new table
	ALTER TABLE - modifies a table
	DROP TABLE - deletes a table
	CREATE INDEX - creates an index (search key)
	DROP INDEX - deletes an index
	 */
}

export interface ISqlCommand {

}
