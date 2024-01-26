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
const sequelize_1 = require("sequelize");
const connectDb_1 = require("../db/connectDb");
class ItemController {
    createItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemCode = req.body.Itemcode;
                console.log(itemCode);
                const translationsData = JSON.stringify(req.body.translations);
                const createData = yield connectDb_1.connectDb.query(`select public.add_item_with_translations(:p_itemcode,:p_translations)`, {
                    replacements: {
                        p_itemcode: itemCode,
                        p_translations: translationsData
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (createData) {
                    res.status(200).json({
                        data: "Succesfully created",
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error
                });
            }
        });
    }
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemId = req.params.ItemId;
                const deleteData = yield connectDb_1.connectDb.query(`select public.delete_item(:itemId)`, {
                    replacements: {
                        itemId: itemId,
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (deleteData) {
                    res.status(204).json({
                        result: "Item deleted succesfully",
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error
                });
            }
        });
    }
    getSpecificItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemId = req.params.ItemId;
                const getData = yield connectDb_1.connectDb.query(`select public.get_item_details(:p_itemid)`, {
                    replacements: {
                        p_itemid: itemId,
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (!getData) {
                    res.status(400).json({
                        error: "Item not found"
                    });
                }
                const result = getData.map((data) => data.get_item_details);
                res.status(200).json({
                    result: result,
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error
                });
            }
        });
    }
    getAllItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const language = req.query.Language;
                const getData = yield connectDb_1.connectDb.query(`select public.get_all_items(:p_language)`, {
                    replacements: {
                        p_language: language,
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                const result = getData.map((data) => data.get_all_items);
                if (getData) {
                    res.status(200).json({
                        result: result,
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error
                });
            }
        });
    }
    // update the item
    updateItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemCode = req.params.itemcode;
                const translationsData = JSON.stringify(req.body.translations);
                const updateData = yield connectDb_1.connectDb.query(`select public.update_item_with_translations(:p_itemcode,:p_translations)`, {
                    replacements: {
                        p_itemcode: itemCode,
                        p_translations: translationsData
                    },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (updateData) {
                    res.status(200).json({
                        result: "Data updated succesfully",
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    error: error
                });
            }
        });
    }
}
exports.default = new ItemController();
//# sourceMappingURL=itemController.js.map