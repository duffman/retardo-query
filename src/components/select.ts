/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-10-17 09:38
 */

import { QueryOp }     from "../types/sql-command.type";
import { IDRecord }    from "../types/types";
import { QueryClause } from "./clauses/clause";
import { With }        from "./clauses/with";

export class Select extends With<Select> implements IDRecord {
	command = QueryOp.Select;

	constructor(
		public columns?: string[]
	) {
		super(columns);
	}
}

/*
export class SelectOld extends QueryClause<QueryOp.Select> implements IDRecord {
	command = QueryOp.Select;
	public name: string = "";
	public alias?: string = undefined;

	isEmpty = () => {
		return !((this.columns ?
						 this.columns.join("").trim()
						 : "") + this.name.trim()).length
	}

	constructor(
		public columns?: string[]
	) {
		super();
	}

	public column(name: string, alias?: string): Select {
		this.name = name;
		this.alias = alias;

		return this;
	}

	public compile(): string {
		if (this.isEmpty()) return "";

		let result = new Array<string>();

		if (this.name.length) result.push(
			(!this.alias ? this.name : `${this.name} AS ${this.alias}`).trim()
		);

		let safeColumns = Array.isArray(this.columns) ? this.columns : [];
		for (let column of safeColumns) {
			result.push(column.trim());
		}

		return result.join(", ");
	}

}
*/

export class SelectAll extends QueryClause<QueryOp.Select> implements IDRecord {
	command = QueryOp.Select;
	constructor(public tableNames: string[]) {
		super();
	}
}

/*
let ss = new Select(["kalle ", "kdsf", "bula"]).column("olle", "uffe");
console.log("select ::", ss.compile());
*/
