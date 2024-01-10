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