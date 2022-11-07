/**
 * The file is part of the Coldmind SQL Igniter project
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com>
 * Licensed under the GNU Lesser General Public License, Version 3.0
 * Find a full copy of the license in the LICENSE.md file located in the project root.
 */

import { From }                                                from "../components";
import { And }                                                 from "../components";
import { SelectCount }                                         from "../components/count";
import { Insert }                                              from "../components/insert";
import { LeftJoin }                                            from "../components/join.operation";
import { Join }                                                from "../components/join.operation";
import { Delete, Drop, With, SubQuery, Into, Limit, OrderBy, } from "../components/operation";
import { SelectAll }    from "../components/select";
import { Select }       from "../components/select";
import { SetOperation } from "../components/set.operation";
import { SetMulti }                                            from "../components/set.operation";
import { Update }                            from "../components/update.operation";
import { WhereRaw }                          from "../components/where";
import { Where, WhereBetween, WhereSimple, } from "../components/where";
import { QueryOp }                           from "../types/sql-command.type";
import { IDRecord }                                                        from "../types/types";
import { Columns }                                                         from "../types/types";
import { CompareType, OrderType }                                          from "../types/types";
import { QueryUtils }                                                      from "../utils/query-utils";
import { VarUtils }                                                        from "../utils/var.utils";

const l = console.log;
const e = console.error;

export interface ISqlIgniter {
	resetQuery(): void;
	debugShowAll(): void;
	escapeVal(value: any): string;
	toSql(): string;
	selectAll(...elements: Array<string>): QueryIgniter;
	count(column: string, alias?: string): QueryIgniter;
	get(table: string): ISqlIgniter;
	select(...param: Array<string>): QueryIgniter;
	update(table: string): QueryIgniter;
	delete(table: string): QueryIgniter;
	insert(data: any, tableName: string, mySQLReplace?: boolean): QueryIgniter;
	replace(data: any, tableName: string): QueryIgniter;
	with(...data: Array<any>): QueryIgniter;
	into(tableName: string): QueryIgniter;
	set(column: string, value: any): QueryIgniter;
	setMulti(data: any, tableName: string): QueryIgniter;
	join(columns: Columns): QueryIgniter;
	inQuery(dynSql: QueryIgniter): QueryIgniter;
	joinTable(tableName: string, on: string, value: any, escapeVal: boolean): QueryIgniter;
	selectAs(fromTable: string, alias?: string): QueryIgniter;
	from(tableName: string, alias?: string): QueryIgniter;
	equals(whereParamsObj: any, value2?: any, whereType?: CompareType): QueryIgniter;
	where(value1: any, value2: any, whereType?: CompareType, escapeValue?: boolean): QueryIgniter;
	orWhere(value1: any, value2?: any, compareType?: CompareType): QueryIgniter;
	andWhere(value1: any, value2?: any, compareType?: CompareType): QueryIgniter;
	andOrWhere(value1: any, value2?: any, compareType?: CompareType): QueryIgniter;
	orAndWhere(value1: any, value2?: any, compareType?: CompareType): QueryIgniter;
	whereBetween(value: any, rangeStart: any, rangeEnd: any): QueryIgniter;
	orderBy(column: string, orderType: OrderType): QueryIgniter;
	orderByRand(): QueryIgniter;
	and(col: string, value: any, compType: CompareType, escapeVal: boolean): QueryIgniter;
	limitBy(fromValue: number, toValue?: number): QueryIgniter;
}

export enum SqlState {
	Unset,
	None,
	Select,
	Select_All,
	Insert,
	InsertMulti,
	Update,
	Update_Set,
	Delete,
}

export class QueryIgniter {
	protected records: Array<IDRecord>;

	protected currRec: IDRecord | null = null;
	protected prevRec: IDRecord | null = null;

	constructor() {
		this.records = new Array<IDRecord>();
	}

	public resetQuery(): void {
		this.records.length = 0;
	}

	public debugShowAll(): void {
		for (let item of this.records) {
			l("item ::", item);
		}
	}

	public escapeVal(value: any): string {
		return `'${ QueryUtils.escape(value) }'`;
	}

	private isSelectRec(arec: any): boolean {
		return arec instanceof Select || arec instanceof SelectAll;
	}

	public toSql(): string {
		let command: QueryOp;

		let inUpdate = false;
		let sql: string = "";

		for (let i = 0; i < this.records.length; i++) {
			this.prevRec = this.currRec;
			this.currRec = this.records[i];


			if (this.currRec instanceof SelectCount) {
				sql += this.parseSelectCount();
			}

			if (this.currRec instanceof Insert) {
				sql += this.parseInsert();
			}

			if (this.currRec instanceof Update) {
				inUpdate = true;
				sql += this.parseUpdate();
			}


			if (this.currRec instanceof Select) {
				sql += this.parseSelect();
			}

			if (this.currRec instanceof SelectAll) {
				sql += this.parseSelectAll();
			}

			if (this.currRec instanceof From) {
				sql += this.parseFrom();
			}

			if (inUpdate && this.currRec instanceof SetOperation) {
				sql += this.parseSet();
			}

			if (this.currRec instanceof SetMulti) {
				sql += this.parseSetMulti();
			}

			if (this.currRec instanceof LeftJoin) {
				sql += this.parseLeftJoin();
			}

			if (VarUtils.isWhereRec(this.currRec)) {
				sql += this.parseWhere();
			}

			if (this.currRec instanceof And) {
				sql += this.parseAnd();
			}

			if (this.currRec instanceof OrderBy) {
				sql += this.parseOrderBy();
			}

			if (this.currRec instanceof Limit) {
				sql += this.parseLimit();
			}
		}

		return sql;
	}



	public selectAll(...elements: Array<string>) {
		this.records.push(new SelectAll(elements));
		return this;
	}

	public count(tableName: string, alias?: string, column: string = "*"): QueryIgniter {
		this.records.push(new SelectCount(tableName, column, alias));
		return this;
	}



	public update(table: string): QueryIgniter {
		this.records.push(new Update(table));
		return this;
	}

	public delete(table: string): QueryIgniter {
		this.records.push(new Delete(table));
		return this;
	}

	public insert(data: any, tableName: string, mySQLReplace?: boolean): QueryIgniter {
		this.resetQuery(); //TODO: Split into multiple queries instead of clearing-
		this.records.push(new Insert(data, tableName, mySQLReplace));
		return this;
	}

	public replace(data: any, tableName: string): QueryIgniter {
		this.resetQuery(); //TODO: Split into multiple queries instead of clearing-
		return this.insert(data, tableName, true);
	}

	public with(...data: Array<any>): QueryIgniter {
		this.records.push(new With(data));
		return this;
	}

	public into(tableName: string): QueryIgniter {
		this.records.push(new Into(tableName));
		return this;
	}

	public set(column: string, value: any): QueryIgniter {
		this.records.push(new SetOperation(column, value));
		return this;
	}

	public setMulti(data: any, tableName?: string): QueryIgniter {
		this.records.push(new SetMulti(data, tableName));
		return this;
	}

	public join(columns: Columns): QueryIgniter {
		this.records.push(new Join(columns));
		return this;
	}

	public subQuery(query: any): QueryIgniter {
		this.records.push(new SubQuery(query));
		return this;
	}

	public joinTable(tableName: string, on: string, value?: any, escapeVal: boolean = true): QueryIgniter {
		this.records.push(new LeftJoin(tableName, on, value, escapeVal));
		return this;
	}

	public equals(whereParamsObj: any, value2?: any, whereType: CompareType = CompareType.Equal): QueryIgniter {
		this.records.push(new Where(whereParamsObj, value2, whereType));
		return this;
	}



	public whereRaw(whereClause: string): QueryIgniter {
		this.records.push(new WhereRaw(whereClause));
		return this;
	}

	public whereIn(): QueryIgniter {
		return this;
	}

	public whereNotIn(): QueryIgniter {
		return this;
	}

	public orWhere(): QueryIgniter {
		return this;
	}

	public orWhereIn(): QueryIgniter {
		return this;
	}

	public orWhereNotIn(): QueryIgniter {
		return this;
	}

	public whereBetween(value: any, rangeStart: any, rangeEnd: any): QueryIgniter {
		this.escapeVal(value);
		let rec = new WhereBetween(CompareType.Between, value, rangeStart, rangeEnd);
		this.records.push(rec);
		return this;
	}

	public orderBy(column: string, orderType: OrderType = OrderType.None): QueryIgniter {
		let rec = new OrderBy(column, orderType);
		this.records.push(rec);
		return this;
	}

	public orderByRand(): QueryIgniter {
		let rec = new OrderBy("RAND()");
		this.records.push(rec);
		return this;
	}



	public limitBy(fromValue: number, toValue?: number): QueryIgniter {
		let rec = new Limit(fromValue, toValue);
		this.records.push(rec);
		return this;
	}

	public createTable(): QueryIgniter {
		return this;
	}

	///////////////////////////////////////////
	//
	//     HELPERS
	//
	///////////////////////////////////////////

	findRecord(command: QueryOp): IDRecord | null {
		let result = this.findRecords(command);
		if (result.length > 0) {
			return result[0];
		} else {
			return null;
		}
	}

	findRecords(command: QueryOp, firstHit: boolean = false): Array<IDRecord> {
		let result: Array<IDRecord> = [];
		for (let i = 0; i < this.records.length; i++) {
			let record = this.records[i];

			if (record.command === command) {
				result.push(record);
				if (firstHit) {
					break;
				}
			}
		}

		return result;
	}

	pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
		return propertyNames.map((n) => o[n]);
	}

	protected parseSelectCount(): string {
		let result = ``;

		if (this.currRec instanceof SelectCount) {
			const rec = this.currRec as SelectCount;

			result += `SELECT COUNT(${rec.column})`;
			if (rec.alias) {
				result += ` AS ${rec.alias}`;
			}

			if (rec.tableName) {
				result += ` FROM ${rec.tableName}`;
			}
		}

		return result;
	}

	protected parseJoin(): string {
		let localCounter = 0;

		for (let i = 0; i < this.records.length; i++) {
			let record = this.records[i];

			if (record instanceof Join) {
				const dRec = record as Join;
			}
		}

		return "";
	}

	////////////////////////////////////////
	//
	//     INSERT
	//
	////////////////////////////////////////

	protected parseInsert(): string {
		let record = this.records[0];

		if (!( record instanceof Insert)) {
			return "";
		}

		let result = "";
		const dRec = record as Insert;
		let insertType = dRec.mySQLReplace ? QueryOp.MySqlReplace : QueryOp.Insert;
		let colNames = new Array<string>();
		let colValues = new Array<any>();

		let obj = dRec.data;

		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				colNames.push(key);
				colValues.push(obj[key]);
			}
		}

		for (let i = 0; i < colValues.length; i++) {
			let value = colValues[i];
			value = this.escapeVal(value);
			colValues[i] = value;
		}

		result = `${insertType} INTO ${dRec.tableName} (${colNames.join(",")}) VALUES (${colValues.join(",")})`;

		return result;
	}

	////////////////////////////////////////
	//
	//     SELECT
	//
	///////////////////////////////////////

	protected parseSelect(): string {
		let result = ``;

		if (this.currRec instanceof Select) {
			const rec = this.currRec as Select;

			if (this.isSelectRec(this.prevRec)) {
				result += ",";
			} else {
				result += "SELECT";
			}

			result += ` ${rec.column}`;
		}

		return result;
	}

	protected parseSelectAll(): string {
		let result = ``;

		if (this.currRec instanceof SelectAll) {
			const rec = this.currRec as SelectAll;
			result += `SELECT * FROM ${rec.tableNames.join(", ")}`;
		}

		return result;
	}

	////////////////////////////////////////
	//
	//     UPDATE
	//
	///////////////////////////////////////

	protected parseUpdate(): string {
		const rec = this.currRec as Update;
		return `UPDATE ${this.escapeVal(rec.table)}`;
	}

	////////////////////////////////////////
	//
	//     DELETE
	//
	///////////////////////////////////////

	protected parseDelete(): string {
		let result = ``;

		if (this.currRec instanceof Delete) {
			result = `DELETE FROM ${this.escapeVal(this.currRec.tableName)}`;
		}

		return result;
	}

	////////////////////////////////////////
	//
	//     DROP
	//
	///////////////////////////////////////

	protected parseDrop(): string {
		let result = "";

		if (this.currRec instanceof Drop) {
			const rec = this.currRec as Drop;
			result = `DROP ${this.escapeVal(rec.tableName)}`;
		}

		return result;
	}

	////////////////////////////////////////
	//
	//     FROM
	//
	///////////////////////////////////////

	protected parseFrom(): string {
		let result = "";

		if (this.currRec instanceof From) {
			const rec = this.currRec as From;

			if (this.prevRec instanceof From) {
				result += ",";
			} else {
				result += " " + QueryOp.From;
			}

			result += " " + rec.name;

			if (rec.alias) {
				result += " AS " + rec.alias;
			}
		}

		return result;
	}

	////////////////////////////////////////
	//
	//     SET
	//
	///////////////////////////////////////

	protected parseSet(): string {
		let result = "";

		if (this.currRec instanceof SetOperation) {
			const rec = this.currRec as SetOperation;

			if (!( this.prevRec instanceof SetOperation)) {
				result += " SET";
			} else {
				result += ", ";
			}

			let val = rec.escape ? this.escapeVal(rec.value) : rec.value;
			result += " " + rec.column + "=" + val;
		}

		return result;
	}

	protected parseSetMulti(): string {
		let record = this.records[0];
		let result = "";

		if (!(record instanceof SetMulti)) {
			return result;
		}

		const dRec: SetMulti = record as SetMulti;

		let setValues = new Array<any>();
		let obj = dRec.data;

		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				setValues.push(`${key}=${this.escapeVal(obj[key])}`);
			}
		}

		if (record.tableName && this.prevRec?.command !== QueryOp.Update) {
			result = `${QueryOp.Update} ${dRec.tableName} `;
		}

		result += `${QueryOp.Set} ${setValues.join(", ")}`;
		return result;
	}

	////////////////////////////////////////
	//
	//     LEFT JOIN
	//
	////////////////////////////////////////

	protected parseLeftJoin(): string {
		let result = "";

		if (this.currRec instanceof LeftJoin) {
			const rec = this.currRec as LeftJoin;

			result += " LEFT JOIN " + rec.table + " ON " + rec.on;

			if (rec.value) {
				rec.value = rec.escapeVal ? this.escapeVal(rec.value) : rec.value;
				result += " = " + rec.value;
			}
		}

		return result;
	} // parseLeftJoin

	////////////////////////////////////////
	//
	//     WHERE
	//
	////////////////////////////////////////

	protected parseWhere(): string {
		let result = ``;

		if (VarUtils.isWhereRec(this.prevRec)) {
			result += " AND ";
		} else {
			result += " WHERE ";
		}

		if (this.currRec instanceof WhereSimple) {
			result += QueryUtils.parseCompareType(this.currRec.value1, this.currRec.value2, this.currRec.whereType);
		}

		if (this.currRec instanceof Where) {
			const rec = this.currRec as Where;

			if (typeof rec.data === "string") {
				result += rec.data;
			} else {
				let colNames = new Array<string>();
				let colValues = new Array<any>();

				let obj = rec.data;

				for (let key in obj) {
					if (obj.hasOwnProperty(key)) {
						colNames.push(key);
						colValues.push(obj[key]);
					}
				}

				let colData = Array<string>();

				for (let i = 0; i < colValues.length; i++) {
					colData.push(`${colNames[i]}=${this.escapeVal(colValues[i])}`);
				}

				result += colData.join(" AND ");
			}
		}

		return result;
	} // parseWhere

	////////////////////////////////////////
	//
	//      And
	//
	////////////////////////////////////////
	protected parseAnd(): string {
		let result = "";

		if (this.currRec instanceof And) {
			let rec = this.currRec as And;
			result += " AND ";

			if (rec.value !== undefined) {
				// Special case for null value
				if (rec.value === null) {
					switch (rec.compare) {
						case CompareType.Equal:
							result += " IS NULL";
							break;

						case CompareType.NotEqual:
							result += " NOT NULL";
							break;
					}
				} else {
					result += QueryUtils.parseCompareType(rec.column, rec.value, rec.compare);
				}
			}
		}

		return result;
	}

	////////////////////////////////////////
	//
	//  Order
	//
	///////////////////////////////////////

	protected parseOrderBy(): string {
		let result = "";

		if (this.currRec instanceof OrderBy) {
			let rec = this.currRec as OrderBy;

			if (this.prevRec instanceof OrderBy) {
				result += ", ";
			} else {
				result += " ORDER BY ";
			}

			result += rec.fieldName;

			if (rec.orderType !== OrderType.None) {
				switch (rec.orderType) {
					case OrderType.Asc:
						result += " ASC";
						break;
					case OrderType.Desc:
						result += " DESC";
						break;
				}
			}
		}

		return result;
	} // end parseOrderBy

	////////////////////////////////////////
	//
	//  Limit
	//
	///////////////////////////////////////
	protected parseLimit(): string {
		let result = "";

		if (this.currRec instanceof Limit) {
			const rec = this.currRec as Limit;
			result += " LIMIT " + rec.fromValue;

			if (rec.toValue != null) {
				result += ", " + rec.toValue;
			}
		}

		return result;
	} // end parseLimit
}
