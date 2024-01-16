import { Item, Payload, Translation, TranslationData } from "../utils/utill";
import *  as xlsx from 'xlsx';

class TranslationService{

    async  generateExcel(payload:any[],outputPath:string):Promise<void> {
        const workbook =  xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(
           
            payload.reduce((result, item) => {
                const translations = item.translations.map((translation:any) => ({
                    ItemCode: item.itemcode,
                    Language: translation.language,
                    Text: translation.text
                }));
                return result.concat(translations);
            }, [] as TranslationData[])
            
            

        )

        xlsx.utils.book_append_sheet(workbook,worksheet,'Translations');
        xlsx.writeFile(workbook,outputPath);
        console.log(`Excel file generated at :${outputPath}`);
    }


   

   
    
}

export default new TranslationService();