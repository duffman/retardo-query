import { QueryOp }     from "../../types/sql-command.type";
import { IDRecord }    from "../../types/types";
import { QueryClause } from "./clause";
import { With }        from "./with";

/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-11-03 23:58
 */

export class From extends With<QueryOp.From> implements IDRecord {
	command = QueryOp.From;

	constructor(
		public columns?: string[]
	) {
		super(columns);
	}

	public column(name: string, alias?: string): QueryClause<QueryOp.From> {
		return super.column(name, alias);
	}

}
