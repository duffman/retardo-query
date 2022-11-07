"use strict";
/**
 * Graphmin CLI Tool
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-11-03
 *
 * Copyright (c) 2022 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBy = void 0;
const clause_1 = require("./clause");
class OrderBy extends clause_1.QueryClause {
    column;
    asc;
    constructor(column, asc) {
        super(column);
        this.column = column;
        this.asc = asc;
    }
}
exports.OrderBy = OrderBy;
//# sourceMappingURL=order-by.js.map