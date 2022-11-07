/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-11-03 23:40
 */

import { QueryOp }     from "../../types/sql-command.type";
import { QueryClause } from "./clause";

export class Or extends QueryClause<QueryOp.Or> {
	constructor() {
		super();
	}
}
