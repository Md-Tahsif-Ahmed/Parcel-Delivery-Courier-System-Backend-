"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        var _a;
        const searchTerm = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            });
        }
        return this;
    }
    // searchByTitle() {
    //   if (this.query.search) {
    //     this.modelQuery = this.modelQuery.find({
    //       title: { $regex: this.query.search, $options: "i" },
    //     } as FilterQuery<T>);
    //   }
    //   return this;
    // }
    searchByTitle() {
        if (this.query.search) {
            this.modelQuery = this.modelQuery.find({
                $text: { $search: this.query.search },
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        const exclude = ["search", "page", "limit", "sort", "fields", "type"];
        exclude.forEach((key) => delete queryObj[key]);
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    sort() {
        var _a;
        const sort = ((_a = this.query.sort) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    //=============== UI specific sorting ==================
    sortByUI() {
        if (this.query.sort === "amount") {
            this.modelQuery = this.modelQuery.sort({ totalAmount: -1 });
            return this;
        }
        if (this.query.sort === "status") {
            this.modelQuery = this.modelQuery.sort({ status: 1 });
            return this;
        }
        this.modelQuery = this.modelQuery.sort({ createdAt: -1 });
        return this;
    }
    // ================ UI specific sorting ==================
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        var _a;
        const fields = ((_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || "-__v";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = this.modelQuery.getFilter();
            const total = yield this.modelQuery.model.countDocuments(filter);
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 10;
            return {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            };
        });
    }
}
exports.default = QueryBuilder;
