export default async function handler(req,res){
  const p=Math.min(95, Math.floor((Date.now()/3000)%100));

  res.status(200).json({
    progress:p,
    eta:Math.max(0,180-p*2),
    done:false
  });
}