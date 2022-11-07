/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-11-03 18:56
 */

import { BaseQuery } from "../components/query";
import { Query }     from "../components/query";

export interface SqlQueryString {
	raw: string;
}

export class GenericCompiler {
	public compile(query: any): SqlQueryString {
		let sqlResult = "";

		console.log("typeOf ::",
			typeof query
		);

		let parentQuery: BaseQuery | null = query;

		while (parentQuery !== null) {
			parentQuery = parentQuery.getParent();
		}

		//parentQuery

		return {
			raw: sqlResult
		}
	}
}

const compiler = new GenericCompiler();

const query = new Query().select().whereIn("jakke", ["ok", "df",  "opk"]);

compiler.compile(query);
