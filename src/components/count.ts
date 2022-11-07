/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-10-18 16:10
 */

import { BaseQuery } from "./query";
import { QueryOp }   from "../types/sql-command.type";
import { IDRecord }  from "../types/types";

export class SelectCount extends BaseQuery<SelectCount> implements IDRecord {
	command = QueryOp.SelectCount;

	constructor(
		public tableName: string,
		public column: string = "*",
		public alias?: string
	) {
		super();
	}
}
