/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-11-01 18:51
 */

import { QueryOp } from "../../types/sql-command.type";

export class QueryClause<T = QueryOp> {
	constructor(public name?: string) {
	}
}




