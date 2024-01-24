"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const xlsx = __importStar(require("xlsx"));
class TranslationService {
    generateExcel(payload, outputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const workbook = xlsx.utils.book_new();
            const worksheet = xlsx.utils.json_to_sheet(payload.reduce((result, item) => {
                const translations = item.translations.map((translation) => ({
                    ItemCode: item.itemcode,
                    Language: translation.language,
                    Text: translation.text
                }));
                return result.concat(translations);
            }, []));
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Translations');
            xlsx.writeFile(workbook, outputPath);
            console.log(`Excel file generated at :${outputPath}`);
        });
    }
    generateExcel1(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const workbook = xlsx.utils.book_new();
            const worksheet = xlsx.utils.json_to_sheet(payload.reduce((result, item) => {
                const translations = item.translations.map((translation) => ({
                    ItemCode: item.itemcode,
                    Language: translation.language,
                    Text: translation.text
                }));
                return result.concat(translations);
            }, []));
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Translations');
            // Create a Blob containing the workbook data
            const blob = xlsx.write(workbook, { bookType: 'xlsx', type: 'blob' });
            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'output.xlsx'; // You can set the default file name here
            // Append the link to the body and trigger the click event
            document.body.appendChild(downloadLink);
            downloadLink.click();
            // Remove the link from the body
            document.body.removeChild(downloadLink);
        });
    }
}
exports.default = new TranslationService();
//# sourceMappingURL=translationService.js.map