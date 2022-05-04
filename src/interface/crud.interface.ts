export interface CRUD{
    list:()=>Promise<any>,
    create:(resource:any)=>Promise<any>,
    readById:(resourceId:any)=>Promise<any>,
    updateById:(resourceId:any,resource:any)=>Promise<any>
    deleteById:(resourceId:any)=>Promise<any>

}