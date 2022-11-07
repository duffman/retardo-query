/**
 * Coldmind AB ("COMPANY") CONFIDENTIAL
 * Unpublished Copyright (c) 2020 Coldmind AB, All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of COMPANY. The intellectual and technical concepts contained
 * herein are proprietary to COMPANY and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
 * from COMPANY.  Access to the source code contained herein is hereby forbidden to anyone except current COMPANY employees, managers or contractors who have executed
 * Confidentiality and Non-disclosure agreements explicitly covering such access.
 *
 * The copyright notice above does not evidence any actual or intended publication or disclosure  of  this source code, which includes
 * information that is confidential and/or proprietary, and is a trade secret, of  COMPANY.   ANY REPRODUCTION, MODIFICATION, DISTRIBUTION, PUBLIC  PERFORMANCE,
 * OR PUBLIC DISPLAY OF OR THROUGH USE  OF THIS  SOURCE CODE  WITHOUT  THE EXPRESS WRITTEN CONSENT OF COMPANY IS STRICTLY PROHIBITED, AND IN VIOLATION OF APPLICABLE
 * LAWS AND INTERNATIONAL TREATIES.  THE RECEIPT OR POSSESSION OF  THIS SOURCE CODE AND/OR RELATED INFORMATION DOES NOT CONVEY OR IMPLY ANY RIGHTS
 * TO REPRODUCE, DISCLOSE OR DISTRIBUTE ITS CONTENTS, OR TO MANUFACTURE, USE, OR SELL ANYTHING THAT IT  MAY DESCRIBE, IN WHOLE OR IN PART.
 *
 * Created by Patrik Forsberg <patrik.forsberg@coldmind.com>
 * File Date: 2018-04-02 14:09
 */

import { QueryOp } from "./sql-command.type";

type Nullable<T> = T | undefined | null;

export enum CompareType {
	Equal,
	SafeEqual, // (Safe to compare NULL values)
	NotEqual,
	GreaterThan,
	GreaterOrEquals,
	LessThan,
	LessOrEquals,
	Between,
	InValue,
	InQuery,
	Or,
	In,
}

export enum OrderType {
	None,
	Asc,
	Desc,
}

export enum ColumnType {
	// Numeric
	TinyInt            = "TINYINT",
	SmallInt           = "SMALLINT",
	MediumInt          = "MEDIUMINT",
	Int                = "INT",
	BigInt             = "BIGINT",
	//
	Decimal            = "DECIMAL",
	Float              = "FLOAT",
	Double             = "DOUBLE",
	Real               = "REAL",
	//
	Bit                = "BIT",
	Boolean            = "BOOLEAN",
	Serial             = "SERIAL",
	// Date and Time
	Date               = "DATE",
	DateTime           = "DATETIME",
	Timestamp          = "TIMESTAMP",
	Time               = "TIME",
	Year               = "YEAR",
	// String
	Char               = "",
	VarChar            = "",
	//
	TinyText           = "TINYTEXT",
	Text               = "TEXT",
	MediumText         = "MEDIUMTEXT",
	LongText           = "LONGTEXT",
	//
	Binary             = "BINARY",
	VarBinary          = "VARBINARY",
	//
	TinyBlob           = "TINYBLOB",
	Blob               = "BLOB",
	MediumBlob         = "MEDIUMBLOB",
	LongBlob           = "LONGBLOB",
	//
	Enum               = "ENUM",
	Set                = "SET",
	// Geometry
	Geometry           = "GEOMETRY",
	Point              = "POINT",
	LineString         = "LINESTRING",
	Polygon            = "POLYGON",
	MultiPoint         = "MULTIPOINT",
	MultiLineString    = "MULTILINESTRING",
	MultiPolygon       = "MULTIPOLYGON",
	GeometryCollection = "GEOMETRYCOLLECTION",

	Json               = "JSON"
}

enum JoinType {
	Inner,
	Outer,
	Left,
	Right,
	Cross,
}

interface IColumn {
	name: string;
	value: any;
	join?: JoinType;
}

//
//
//

export type SelectOperation = QueryOp.Select |
							  QueryOp.SelectRaw |
							  QueryOp.SelectAvg |
							  QueryOp.SelectCount |
							  QueryOp.SelectMin |
							  QueryOp.SelectMax;

type InsertOperation = QueryOp.Insert

export type WhereOperation = QueryOp.Where |
							 QueryOp.WhereRaw |
							 QueryOp.WhereIn |
							 QueryOp.WhereNotIn |
							 QueryOp.OrWhere |
							 QueryOp.OrWhereNotIn |
							 QueryOp.WhereBetween;

export const SqlSelect = [ QueryOp.Select, QueryOp.SelectRaw, QueryOp.SelectAvg ] as const;
export const SqlWhere = [ QueryOp.Where, QueryOp.WhereRaw, QueryOp.WhereIn, QueryOp.WhereNotIn];
export const SqlInsert = [ QueryOp.Insert] as const;

export interface IDRecord {
	command: QueryOp;
}

export type DRec = Nullable<IDRecord>;
export type Columns = Array<IColumn>;

interface ObjectLiteral {
	[key: string]: any;
}

export type MultiValueArray = any; // ObjectLiteral[];
