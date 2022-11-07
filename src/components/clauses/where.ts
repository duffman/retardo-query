/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-11-02 15:36
 */
import { QueryOp }     from "../../types/sql-command.type";
import { QueryClause } from "./clause";

export class Where extends QueryClause<QueryOp.Where> {
	constructor() {
		super();
	}
}
