/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-10-18 16:22
 */

import { BaseQuery } from "./query";
import { QueryOp }   from "../types/sql-command.type";
import { IDRecord }  from "../types/types";

export class Insert extends BaseQuery<Insert> implements IDRecord {
	command = QueryOp.Insert;

	constructor(
		public data: any,
		public tableName: string,
		public mySQLReplace?: boolean
	) {
		super();
	}
}
