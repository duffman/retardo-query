/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-11-03 23:48
 */

import { QueryOp }     from "../../types/sql-command.type";
import { CompareType } from "../../types/types";
import { IDRecord }    from "../../types/types";
import { QueryClause } from "./clause";

export class And extends QueryClause<QueryOp.And> implements IDRecord {
	public command = QueryOp.And;
	constructor(
		public column: string,
		public value: any = undefined,
		public compare: CompareType = CompareType.Equal,
		public escapeVal: boolean = true
	) {
		super();
	}
}
