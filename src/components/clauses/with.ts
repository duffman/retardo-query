import { BaseQuery }   from "../query";
import { Query }       from "../query";
import { QueryClause } from "./clause";

/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-11-04 00:09
 */

export class With<T> extends BaseQuery<T> {
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

	public column(name: string, alias?: string): QueryClause<T> {
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
