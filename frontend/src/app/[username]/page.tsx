import axios from "axios"

async function getCreator(username:string){

 const res = await axios.get(
  `http://localhost:5000/api/creator/${username}`
 )

 return res.data

}

export default async function CreatorPage({
 params
}:any){

 const data = await getCreator(params.username)

 const { user, blocks } = data

 return(

  <div className="min-h-screen bg-stone-50 flex justify-center py-16">

   <div className="w-full max-w-md flex flex-col gap-4">

    {/* Creator header */}

    <div className="text-center mb-6">

     <div className="w-20 h-20 rounded-full bg-stone-300 mx-auto mb-3"/>

     <h1 className="text-xl font-semibold">
      {user.username}
     </h1>

    </div>

    {/* Blocks */}

    {blocks.map((block:any)=>{

     if(block.type==="link"){

      return(

       <a
        key={block._id}
        href={block.content?.url || "#"}
        className="bg-black text-white py-3 rounded-lg text-center"
       >
        {block.content?.title || "Link"}
       </a>

      )

     }

     if(block.type==="text"){

      return(
       <p key={block._id} className="text-center">
        {block.content?.text}
       </p>
      )

     }

     return null

    })}

   </div>

  </div>

 )

}