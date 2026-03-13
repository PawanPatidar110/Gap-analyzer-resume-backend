import { TfIdf } from "natural";


export function calculateSimilarity(resumeText:string,jobText:string){
    const tfidf = new TfIdf();

    tfidf.addDocument(resumeText);
    tfidf.addDocument(jobText);

    const resumeVector:number[] = [];
    const jobVector:number[] = [];

    const terms:string[] = [];


    tfidf.listTerms(0).forEach((item) => terms.push(item.term));
    tfidf.listTerms(1).forEach((item) =>{
        if(!terms.includes(item.term)) terms.push(item.term);
    });

    terms.forEach((term) =>{
        resumeVector.push(tfidf.tfidf(term,0));
        jobVector.push(tfidf.tfidf(term,1));
        });

        return cosineSimilarity(resumeVector, jobVector);
}

function cosineSimilarity(a:number[],b:number[]){
 let dotProduct = 0;
 let normA = 0;
 let normB =0;

 for(let i=0; i<a.length;i++){
    dotProduct +=  a[i]*b[i];
    normA += a[i]*a[i];
    normB += b[i]*b[i];
 }

 return dotProduct / (Math.sqrt(normA)*Math.sqrt(normB));
}
