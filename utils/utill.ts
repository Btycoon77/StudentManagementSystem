export interface PaginationParams{
    pageSize:number;
    page:number;
    search:string;
    orderBy: string;
    orderDir: string;
};

export interface ChapterInfo{
    chapter_id:number;
    name:string;
    description: string;
    parent_id:number | null;
    subject_id: number;
    guid:string
}

export interface ChapterMap{
    chapter_name:string,
    chapter_id: number,
    desc: string,
    parent_id: number,
    subject_id: number,
    children: any[],
  };

  export interface ChapterHierarchy{
    ChapterName:string,
    Description:string,
    // SubjectName:string
    ParentChapter:string,
    
    Children: ChapterHierarchy[],
  };

  export interface OriginalData {
    ItemCode: string;
    EN: string;
    NP: string;
  }
  
  export interface TransformedData {
    itemcode: string;
    translations: Translation[];
  }
  
  export interface Translation {
    text: string;
    language: string;
  }

  export interface Item{
    itemcode: string;
    translations: Translation[]
  }

  export interface Payload{
    data: Item[]
  }

  export interface TranslationData {
    ItemCode: string;
    Language: string;
    Text: string;
}