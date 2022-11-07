/**
 * The file is part of the Coldmind SQL Igniter project
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com>
 * Licensed under the GNU Lesser General Public License, Version 3.0
 * Find a full copy of the license in the LICENSE.md file located in the project root.
 */

import { QueryClause }                               from "./clauses/clause";
import { Query }                                     from "./query";
import { QueryOp }                                   from "../types/sql-command.type";
import { Columns, CompareType, IDRecord, OrderType } from "../types/types";

export class SubQuery<T> extends QueryClause<QueryOp.SubQuery> implements IDRecord {
	public command = QueryOp.SubQuery;
	constructor(public query: Query<T>) {
		super();
	}
}


export class Delete implements IDRecord {
	public command = QueryOp.In;
	constructor(public tableName: string) {}

}

export class Drop implements IDRecord {
	public command = QueryOp.Drop;
	constructor(public tableName: string) {}
}

export class With implements IDRecord {
	command = QueryOp.With;
	public data: Array<string>;

	constructor(...data: Array<any>) {
		this.data = data;
	}
}

export class Into implements IDRecord {
	command = QueryOp.Select;
	constructor(public tableName: string) {}
}



export class OrderBy implements IDRecord {
	command = QueryOp.OrderBy;
	constructor(public fieldName: string,
				public orderType: OrderType = OrderType.None,
				public escapeVal?: boolean) {}
}

export class Limit implements IDRecord {
	public command = QueryOp.Limit;
	constructor(
		public fromValue: number,
		public toValue?: number
	) {}
}
