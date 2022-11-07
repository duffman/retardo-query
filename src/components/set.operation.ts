import { QueryOp }  from "../types/sql-command.type";
import { IDRecord } from "../types/types";

/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-10-18 16:13
 */

export class SetOperation implements IDRecord {
	command = QueryOp.Set;
	constructor(public column: string, public value: any, public escape: boolean = true) {}
}

export class SetMulti implements IDRecord {
	command = QueryOp.Update;
	constructor(public data: any, public tableName?: string) {}
}
