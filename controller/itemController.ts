import { QueryTypes } from "sequelize";
import { connectDb } from "../db/connectDb";
import {Request,Response} from 'express';

class ItemController{

    async createItem(req:Request,res:Response):Promise<any>{
        try {
         const itemCode = req.body.Itemcode;
         console.log(itemCode);
         const translationsData =JSON.stringify(req.body.translations);
         
        const createData = await connectDb.query(`select public.add_item_with_translations(:p_itemcode,:p_translations)`,{
            replacements:{  
                p_itemcode:itemCode,
                p_translations:translationsData
                
            },
            type:QueryTypes.SELECT
        });
       
        if(createData){
            res.status(200).json({
                data: "Succesfully created",

            })
        }
        
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error:error
            })
        }
    }

    async deleteItem(req:Request,res:Response):Promise<any>{
        try {
            const itemId = req.params.ItemId;
            
           const deleteData = await connectDb.query(`select public.delete_item(:itemId)`,{
               replacements:{  
                   itemId:itemId,
                   
               },
               type:QueryTypes.SELECT
           });
          
           if(deleteData){
               res.status(204).json({
                   result:"Item deleted succesfully",
   
               })
           }
           
           } catch (error) {
               console.log(error);
               res.status(500).json({
                   error:error
               })
           }
    }

    async getSpecificItem(req:Request,res:Response):Promise<any>{
        try {
            const itemId = req.params.ItemId;

            
           const getData = await connectDb.query(`select public.get_item_details(:p_itemid)`,{
               replacements:{  
                   p_itemid:itemId,
                   
               },
               type:QueryTypes.SELECT
           });
          
           
          if(!getData){
            res.status(400).json({
                error: "Item not found"
            })
          }
          const result = getData.map((data:any)=>data.get_item_details);
         res.status(200).json({
                   result:result,
   
         })
           
           
           } catch (error) {
               console.log(error);
               res.status(500).json({
                   error:error
               })
           }
    

    }

    async getAllItems(req:Request,res:Response):Promise<any>{
        try {
            const language = req.query.Language;

            
           const getData = await connectDb.query(`select public.get_all_items(:p_language)`,{
               replacements:{  
                   p_language:language,
                   
               },
               type:QueryTypes.SELECT
           });
          
           const result = getData.map((data:any)=>data.get_all_items);
           if(getData){
               res.status(200).json({
                   result:result,
   
               })
           }
           
           } catch (error) {
               console.log(error);
               res.status(500).json({
                   error:error
               })
           }
    }

    // update the item
    async updateItem(req:Request,res:Response):Promise<any>{
        try {
           
            const itemCode = req.params.itemcode;
            const translationsData = JSON.stringify(req.body.translations);

            
           const updateData = await connectDb.query(`select public.update_item_with_translations(:p_itemcode,:p_translations)`,{
               replacements:{  
                   p_itemcode:itemCode,
                   p_translations:translationsData
                   
               },
               type:QueryTypes.SELECT
           });
          
           if(updateData){
               res.status(200).json({
                   result:"Data updated succesfully",
   
               })
           }
           
           } catch (error) {
               console.log(error);
               res.status(500).json({
                   error:error
               })
           }
    }


}

export default new ItemController();