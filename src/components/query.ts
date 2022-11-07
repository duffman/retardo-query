/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-11-01 18:37
 */

import { GenericCompiler } from "../compilers/generic.compiler";
import { QueryOp }         from "../types/sql-command.type";
import { MultiValueArray } from "../types/types";
import { CompareType }     from "../types/types";
import { And }             from "./clauses/and";
import { From }            from "./clauses/from";
import { SelectAll }  from "./select";
import { Select }     from "./select";
import { WhereMulti } from "./where";
import { WhereIn }         from "./where";
import { QueryClause }     from "./clauses/clause";
import { OrderBy }         from "./clauses/order-by";

export abstract class AbstractQuery {
	protected constructor(protected parent: AbstractQuery) {
	}
}

export enum DbType {
	Generic,
	MySql,
	PostgreSQL
}

export class BaseQuery<T = AbstractQuery> {
	protected parent?: BaseQuery<any>;

	protected newChild<A>(query: BaseQuery<A>): BaseQuery<A> {
		query.setParent<T>(this);
		return query;
	}


	public clauses = new Array<QueryClause>();

	constructor(public dbType: DbType = DbType.Generic) {
	}

	public getParent(): BaseQuery | null {
		if (this?.parent) {
			return this.parent as BaseQuery;
		}
		else {
			return null;
		}
	}

	public setParent<T = any>(value: BaseQuery<T>): T {
		if (Object.is(this, value)) {
			throw new Error(`Cannot set the same ${ AbstractQuery.constructor.name } as a parent of itself`);
		}

		this.parent = value;
		return this as unknown as T;
	}

	public addComponent(clause: QueryClause, op?: QueryOp): T {
		this.clauses.push(clause);
		return this as unknown as T;
	}

	public toSql(): string {
		return new GenericCompiler().compile(this).raw;
	}

}

export class Query<T> extends BaseQuery<Query<T>> {

	public subQuery<Q>(query: Query<Q>): Query<T> {
		//this.records.push(new SubQuery(query));
		return this;
	}

	public get(...tableName: string[]): Query<T> {
		this.newChild(
			new Query<Select>()
		)

		this.addComponent(
			new SelectAll(tableName)
		);

		return this;
	}

	public select(...values: string[]): Query<Select> {
		return  this.newChild<Select>(
			new Select(values)
		) as Query<Select>
	}

	public selectAs(fromTable: string, alias?: string): Query<T> {
		this.addComponent(new Select().column(fromTable, alias));
		return this;
	}


	public from(...value: string[]): Query<T> {
		let cmp: QueryClause;

		this.addComponent(
			new From(value)
		);

		return this;
	}
	//

	public whereRaw(expression: string) {
		if (expression)
			expression = "ff";
		return this;
	}


	public where(value: MultiValueArray, fromTable?: string): WithQuery<T> {
		this.addComponent(
			new WhereMulti(value, fromTable)
		);

		return this;
	}

	public whereIn(value: any, ...values: any[]): WithQuery<T> {
		this.addComponent(
			new WhereIn(value, values),
			QueryOp.WhereIn
		);

		return this;
	}

	public whereNotIn(): WithQuery<T> {
		return this;
	}

	public orWhere(): WithQuery<T> {
		/*	this.addComponent(
		 new OrWhere()
		 );*/
		return this;
	}

	public orWhereIn() {
	}

	public orWhereNotIn() {
	}

	public and(
		col: string, value: any = null,
		compType: CompareType   = CompareType.Equal,
		escapeVal: boolean      = true
	): WithQuery<T> {
		this.addComponent(
			new And(
				col,
				value,
				compType,
				escapeVal
			)
		);

		return this;
	}
}


