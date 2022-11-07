/**
 * The file is part of the Coldmind SQL Igniter project
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com>
 * Licensed under the GNU Lesser General Public License, Version 3.0
 * Find a full copy of the license in the LICENSE.md file located in the project root.
 */

import { QueryOp }               from "../types/sql-command.type";
import { MultiValueArray }       from "../types/types";
import { CompareType, IDRecord } from "../types/types";
import { QueryClause }           from "./clauses/clause";
import { BaseQuery }             from "./query";

export enum whereOperation {
	equal           = "=",
	greaterThan     = ">",
	lessThan        = "<",
	greaterOrEqual  = ">=",
	lessThanOrEqual = "<=",
	notEqual        = "<>",
	like            = "LIKE",
	in              = "IN"
}

export class Where extends QueryClause<QueryOp.Where> implements IDRecord {
	constructor(
		public data: any,
		public value?: any,
		public compareType: CompareType = CompareType.Equal
	) {
		super();
	}

	command = QueryOp.Where;
}

/**
 * Allows you to write a freehand where and
 * QueryIgniter will not try to protect your field or table names
 */
export class WhereRaw extends QueryClause<QueryOp.WhereRaw> implements IDRecord {
	command = QueryOp.WhereRaw;

	constructor(public whereClause: string) {
		super();
	}
}

/**
 * Generates a WHERE field IN (‘item’, ‘item’) SQL query
 * joined with AND if appropriate
 */
export class WhereIn extends QueryClause<QueryOp.WhereIn> implements IDRecord {
	command = QueryOp.WhereIn;
	public inValues: any[] = [];

	constructor(public value: any, ...values: any[]) {
		super();
	}
}

/**
 * Generates a WHERE field NOT IN (‘item’, ‘item’) SQL query
 * joined with AND if appropriate
 */
export class WhereNotIn extends QueryClause<QueryOp.WhereNotIn> implements IDRecord {
	command = QueryOp.WhereNotIn;
}

export class OrWhere extends QueryClause<QueryOp.OrWhere> implements IDRecord {
	command = QueryOp.OrWhere;

	constructor() {
		super();
	}
}

/**
 * Generates a WHERE field IN (‘item’, ‘item’) SQL query
 * joined with OR if appropriate
 */
export class OrWhereIn extends QueryClause<QueryOp.OrWhereIn> implements IDRecord {
	command = QueryOp.OrWhereIn;
}

/**
 * Generates a WHERE field NOT IN (‘item’, ‘item’) SQL query
 * joined with AND if appropriate
 */
export class OrWhereNotIn extends QueryClause<QueryOp.WhereNotIn> implements IDRecord {
	command = QueryOp.OrWhereNotIn;
}

export class WhereSimple extends QueryClause<QueryOp.Where> implements IDRecord {
	command = QueryOp.Where;

	constructor(
		public value1: any,
		public value2: any            = null,
		public whereType: CompareType = CompareType.Equal,
		public escape: boolean        = true
	) {
		super();
	}
}

export class WhereBetween extends QueryClause<QueryOp.WhereBetween> implements IDRecord {
	command = QueryOp.WhereBetween;

	constructor(
		public type: CompareType,
		public that: any,
		public value1: any,
		public value2?: any
	) {
		super();
	}
}

export class WhereMulti extends QueryClause<QueryOp.Where> implements IDRecord {
	public command = QueryOp.Where;

	constructor(
		public data: MultiValueArray,
		public tableName?: string
	) {
		super();
	}
}
