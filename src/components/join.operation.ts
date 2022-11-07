/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-10-17 09:36
 */

import { QueryOp }  from "../types/sql-command.type";
import { Columns }  from "../types/types";
import { IDRecord } from "../types/types";

export class Join implements IDRecord {
	command = QueryOp.Join;
	constructor(public columns: Columns) {}
}

/**
 * The RIGHT JOIN keyword returns all records from
 * the right table (table2), and the matching
 * records from the left table (table1).
 * The result is 0 records from the left
 * side, if there is no match.
 */

export class RightJoin implements IDRecord {
	public command = QueryOp.RightJoin;

	constructor(
		public table: string,
		public on: string,
		public value: any = null,
		public escapeVal: boolean = true
	) {}
}

export class LeftJoin implements IDRecord {
	public command = QueryOp.LeftJoin;

	constructor(
		public table: string,
		public on: string,
		public value: any = null,
		public escapeVal: boolean = true
	) {}
}
