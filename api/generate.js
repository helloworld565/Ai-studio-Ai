export default async function handler(req,res){
  if(req.method!=="POST"){
    return res.status(405).json({error:"Method not allowed"});
  }

  const id="job_"+Date.now();

  res.status(200).json({
    name:id
  });
}