/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-10-17 14:31
 */

import { QueryOp }  from "../types/sql-command.type";
import { IDRecord } from "../types/types";

export class Update implements IDRecord {
	command = QueryOp.Update;
	constructor(public table: string) {
	}
}
