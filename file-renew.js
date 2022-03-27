const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios');
const { promises: fs }  = require("fs");
const path= require( 'path' );
let templates ={};
// const { promisify } = require('util');

// const readFileAsync = promisify(fs.readFile)
// const writeFileAsync = promisify(fs.writeFile)

// const yargs = require('yargs');

// var aws = require("aws-sdk");
// var awsOptions = {
//     // accessKeyId: "AKIAWRCMV3ANRRGOHC4M",
//     // secretAccessKey: "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",
//     // region: "ap-northeast-1",
//        region: "ap-northeast-1",
//     accessKeyId: 'AKIAI6FDT6Z3WRGPB7QQ',
//     secretAccessKey: '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'
// };


// aws.config.update(awsOptions);
// var s3 = new aws.S3();
// const {CONFIG} = require('./config');


(async () => {
    let srcFile,srcLocation;
      process.argv.forEach(function (val, index, array) {
            console.log(index + ': ' + val);
            if (index==2)
                srcLocation = val;
    });

    const files = await fs.readdir( srcLocation );
// console.log(files);
    // Loop them all with the new for...of
    for( const file of files ) {
        // Get the full paths
        const fromPath = path.join( srcLocation, file );

        // Stat the file to see if we have a file or dir
        const stat = await fs.stat( fromPath );

        if( stat.isFile() ) {
            if (fromPath.indexOf(".html")>-1) {
                console.log(fromPath);
                await pageReBuild(fromPath);

            }
        }


    } // End for...of

    // await pageReBuild('products.html');

  console.log('End');

})();

async function pageReBuild(srcFile){
    let srcContent='';
    let destContent;
    
    srcContent = await fs.readFile(srcFile, "utf-8");

    templates = await getAllTemplates('_user/template.html');
    // console.log('Template',templates);
    destContent = await reBuild(srcContent);
    destContent = await dataReBuild(destContent);
    // console.log(destContent);
    await fs.writeFile(srcFile, destContent);
}



//  const {NewElasticTable} = require('./NewElastic');
async function getData(dataId){
    let str = await fs.readFile('_data/'+dataId, "utf-8");
    let data = JSON.parse(str);
    return data;
}

async function dataFillUp(element,dataId){
         
         // let html = item.innerHTML;
         let dataProfile;
        //  let dataId = item.getAttribute('dz-data-id') || null;
         
        if (dataId){
            let str = await fs.readFile('_data/'+dataId,'utf-8');
            dataProfile = JSON.parse(str);
        } 
        let query = dataProfile.query || {
            "match_all":{}
        };
        let templateId = dataProfile.templateId;
        let template = templates[templateId];
        let data = dataProfile.data;
        // if (queryId){
        //     let str = await fs.readFile('_query/'+dataId,'utf-8');
        //     let query = JSON.parse(str);
        //     let uid = query.uid;
        //     let table = query.table;
        //     data = await getAllRecords(uid,table,query.query);
        // }
        let content = '';
        if (!data){
            let uid = dataProfile.uid;
            let table = dataProfile.table;
            data = await getAllRecords(uid,table,query);
            console.log('Data',data);
        }

        data.forEach(item=>{
            content += replaceToken(item,template);
        });
        element.innerHTML = content;   
 }

async function dataReBuild(html){
    const dom = new JSDOM(html);
    let data;
     let items = dom.window.document.querySelectorAll("[dz-data-id]");
     for (let i=0;i<items.length; i++){
         let item = items[i];
         // let html = item.innerHTML;
        let dataId = item.getAttribute('dz-data-id') || null;
        if (dataId)
            await dataFillUp(item,dataId);
     }
     
     return dom.window.document.documentElement.outerHTML;
 }

async function reBuild(html){
   const dom = new JSDOM(html);
    let items = dom.window.document.querySelectorAll("[dz-template-id]");
    for (let i=0;i<items.length; i++){
        let item = items[i];
        // let html = item.innerHTML;
        let templateId = item.getAttribute('dz-template-id') || null;
        
        if (templateId) {
            // let lastModified = await LastModified(bucket,'_templates/'+templateId);
            // if (lastModified>pageModified){
                let content = templates[templateId];
                item.innerHTML = content;                                                
            // }
        }
    }
    
    return dom.window.document.documentElement.outerHTML;
}



async function getHtml(src){
    let srcContent;
    await fs.readFile(src, "utf-8", (err, data) => {
        // console.log(data);
        srcContent = data;
    });
    return srcContent;
}
// exports.handler = async (event, context) => {
    
//     let html;
//     // let isExist = await headFile('dazzle-template','user-data/happy/cache/product/13');
    
//     let bucket = event.bucket;
//     let page = event.key;
//     let uid = bucket.replace(".dazzle.website","");
    
//     let action = event.action;
//     console.log('ACTION',action);
//     switch(action){
//         case 'PAGE_GENERATION':
//             console.log('Here');
//             html = await pageGeneration(bucket,page);
//             done(100,'Success',html);    

//         break;
        
//         case 'DATA_PAGE_GENERATION':
            
//             let [table,id] = page.split("/");
//             // let table = 'product';
//             // let id = 'D8-907';
//             html = await dataPageGeneration(uid,table,id);
//              done(100,'Success',html);  
//         break;
//         default:
//             console.log('There');
//              done(100,'Fail','');  
    
//         break;
//     }
    
//     function done(code, text, data) {
//         var result = {};
//         result.code = code;
//         result.text = text;
//         if (result.code > 0) {
//             result.resolve = data;
//         }
//         else {
//             result.reject = data || text;
//         }
//         context.succeed(result);
//     }


// };
async function dataPageGeneration(uid,table,id){

        let html;
        let bucket = uid+'.dazzle.website';
        let page = table+'/'+id;
        console.log('Data',bucket,table);
        // let templateLastModified = await LastModified('happy.dazzle.website','_templates/_header');
        // let template = await getFile('happy.dazzle.website','_templates/_header');
                // html = await getFile(bucket,page);
        let pageLastModified = await LastModified(bucket,table+'/template.html');
        let template = await getFile(bucket,table+'/template.html');
        // console.log('Template',template);
        let record = await getRecord(uid,table,id);
        html = await replaceToken(record,template);
        html = await reBuild(bucket,html,pageLastModified);
        // await saveFile(bucket,'cache/'+page,html);
        return html;
    
}
async function pageGeneration(bucket,page){

        let html;
        // let templateLastModified = await LastModified('happy.dazzle.website','_templates/_header');
        // let pageLastModified = await LastModified(bucket,page);
        let pageLastModified = null;
        html = await getFile(bucket,page);
        console.log('Get File');
        html = await reBuild(bucket,html);
        console.log('ReBuild');
        html = await dataFillUp(bucket,html);
        console.log('Data Fill UP');
        await saveFile(bucket,'cache/'+page,html);
    
        return html;
}
        



    
async function saveTemplate(id,bucket,string){
    
        await saveFile(bucket,'_templates/'+id,string);
        
}
 function saveFile(bucket,key, string) {

        return new Promise(function(resolve, reject) {
         
            let params = {
                Bucket: bucket,
                Key: key,
                Body: string,
                ContentType: "text/html",
            };

            s3.putObject(params, function(err, data) {
                if (!data){
                    reject();
                }
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(data);
                    resolve(data);
                }
            });
        });
    }




async function getAllRecords(uid,table,query=null){
    try {
        console.log('Query',query);
        let json = {
            "query":query
        }


        const res = await axios.post('https://db.dazzle.website/'+uid+'.'+table+'/_search',json,{
              auth: {
                'username': 'admin',
                'password': 'Admin@123'
              }
            });
        let data = res.data.hits.hits;
        
        let lists = [];
        data.forEach(item=>{
           lists.push(item._source); 
        });
        console.log('All Data',lists);
        
        return lists;

    } catch(e){
        
        return [];
    }

    
}

async function getRecord(uid,table,id){
    try {
        const {data} = await axios.get('https://db.dazzle.website/'+uid+'.'+table+'/_doc/' + id, {
              auth: {
                'username': 'admin',
                'password': 'Admin@123'
              }
            });
    
        // console.log('Data',data);
        return data._source;

    } catch(e){
        
        return {};
    }

    // let options = {
    //     'table': table,
    //     'uid': uid
    // };
    // console.log('Options',options);
    
    // let params = {
    //       ...options,
    //       endpoint: CONFIG.NEW_ELASTIC_SEARCH_ENDPOINT,
    //       auth: {
    //         username: 'admin',
    //         password: 'Admin@123',
    //       },
    //     }
    //     console.log('Params',params);
    //  let tableManager = new NewElasticTable(params);
 
    // let record = await tableManager.getRecordById(id);
    
}
function replaceToken(data,html){
    
    // let options = {
    //     table: 'user',
    //     uid:'dazzle'
    // };
    
    
    //  let table = new NewElasticTable({
    //       ...options,
    //       endpoint: CONFIG.NEW_ELASTIC_SEARCH_ENDPOINT,
    //       auth: {
    //         username: 'admin',
    //         password: 'Admin@123',
    //       },
    //     });
 
    // let html2 = table.replaceToken(data,html);
    // // console.log('Replace',html2);
    // return html2;
    
       // let index = this.index;
        data = reformData(data);
        // var re = new RegExp('(\[\[([0-9a-zA-Z_| ]*)\]\])');
        const regexp = /(\[\[([0-9a-zA-Z_| ]*)\]\])/g;
        const array = [...html.matchAll(regexp)];
        let arr = [];
        array.forEach(item=>{
            arr.push(item[0]); 
        });
        
        // console.log('Array',array);
        arr.forEach(item=>{
            
            let orgItem,token,action,result;
            if (item){
                orgItem = item;
                item = item.replace("[[","");
                item = item.replace("]]","");
                [token,action] = item.split("|");
                if (typeof action === "undefined")
                    action = null;
                token = token.trim();
                token = data[token];

                if (action)
                    action = action.trim();
                    
                else
                    action = null;

                if (action)
                    result = preprocess(token,action);
                else
                    result = token;
                
                
                html = html.replace(orgItem,result);                
                
            }

        });
        
        return html;

        
        function reformData(data){
            // data['_index'] = index;
            for (let k in data){
                if (Array.isArray(data[k])) {
                    let item = data[k];
                    for (let i=0;i<item.length;i++)
                        data[k+i.toString()] = item[i];
                }            
            }
            return data;
        }
    function preprocess(token,action){
        if (!action)
            return token;
            
        switch(action) {
            case 'date':
                let date = new Date(token);
                let str = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
                return str;                        
            break;
            
            case 'boolean':
                let bool = token;
                if (bool)
                    return 'dz-true';
                else
                    return 'dz-false';
            break;

            default:
                return token;
            break;
            
        }
        
    }
}
async function getAllTemplates(src){
    let templates = {};
    let html;
    html = await fs.readFile(src, "utf-8");
    const dom = new JSDOM(html);
    let changed = false;
     let items = dom.window.document.querySelectorAll("template");
     for (let i=0;i<items.length; i++){
         let item = items[i];
         // let html = item.innerHTML;
        //  let templateId = item.getAttribute('dz-template-id') || null;
        let id = item.getAttribute('id'); 
        templates[id] = item.innerHTML;        
     }
     
     return templates;
 
 }
    



 function headFile(bucket, key) {
    return new Promise(function (resolve, reject) {
        var params = {
            Bucket: bucket,
            Key: key
        };
        console.log(params);
        s3.headObject(params, function (err, data) {
            //console.log('Data',data);
             if (err && err.code === 'NotFound') {  
                 resolve(false);
    // Handle no object on cloud here  
              } else {  
                  
                //   console.log('Data',data);
                 resolve(true);
              }
         });
    });
}

function LastModified(bucket, key) {
    return new Promise(function (resolve, reject) {
        var params = {
            Bucket: bucket,
            Key: key
        };
        console.log(params);
        s3.headObject(params, function (err, data) {
            //console.log('Data',data);
             if (err && err.code === 'NotFound') {  
                 resolve(null);
    // Handle no object on cloud here  
              } else {  
                  
                //   console.log('Data',data);
                 resolve(data.LastModified);
              }
         });
    });
}

 
 

function getFile(bucket, key) {
    return new Promise(function (resolve, reject) {
        var params = {
            Bucket: bucket,
            Key: key
        };
        s3.getObject(params, function (err, data) {
            // console.log('Data',data,err);
            if (err) {
                reject(err);
            } else {
                // console.log('')
                resolve(data.Body.toString());
            }
        });
    });
}