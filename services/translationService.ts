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


    async generateExcel1(payload: any[]): Promise<void> {
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(
            payload.reduce((result, item) => {
                const translations = item.translations.map((translation: any) => ({
                    ItemCode: item.itemcode,
                    Language: translation.language,
                    Text: translation.text
                }));
                return result.concat(translations);
            }, [] as TranslationData[])
        );
    
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Translations');
    
        // Create a Blob containing the workbook data
        const blob = xlsx.write(workbook, { bookType: 'xlsx', type: 'blob' } as any);
    
        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'output.xlsx'; // You can set the default file name here
    
        // Append the link to the body and trigger the click event
        document.body.appendChild(downloadLink);
        downloadLink.click();
    
        // Remove the link from the body
        document.body.removeChild(downloadLink);
    }
    

   
    
}

export default new TranslationService();