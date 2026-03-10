import axios from "axios"
import Image from "next/image"

type Block = {
  _id: string
  type: string
  content: any
}

type CreatorData = {
  user: {
    username: string
    theme?: string
  }
  blocks: Block[]
}

async function getCreator(username: string): Promise<CreatorData> {

  const res = await axios.get(
    `http://localhost:5000/api/creator/${username}`
  )

  return res.data

}

export default async function CreatorPage({
  params
}: {
  params: { username: string }
}) {

  const data = await getCreator(params.username)

  const { user, blocks } = data

  const themeStyles: Record<string, string> = {
    minimal: "bg-white text-black",
    dark: "bg-black text-white",
    gradient:
      "bg-gradient-to-b from-purple-500 to-pink-500 text-white"
  }

  const themeClass =
    themeStyles[user.theme || "minimal"]

  return (

    <div className={`min-h-screen ${themeClass}`}>

      <div className="flex justify-center py-16">

        <div className="w-full max-w-md flex flex-col gap-4">

          {/* Profile */}

          <div className="text-center mb-6">

            <div className="w-20 h-20 rounded-full bg-stone-300 mx-auto mb-3"/>

            <h1 className="text-xl font-semibold">
              @{user.username}
            </h1>

          </div>

          {/* Blocks */}

          {blocks.map((block) => {

            if (block.type === "link") {

              return (
                <a
                  key={block._id}
                  href={block.content?.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white py-3 rounded-lg text-center hover:opacity-90"
                >
                  {block.content?.title || "Link"}
                </a>
              )

            }

            if (block.type === "text") {

              return (
                <p
                  key={block._id}
                  className="text-center"
                >
                  {block.content?.text}
                </p>
              )

            }

            if (block.type === "image") {

              return (
                <div
                  key={block._id}
                  className="relative w-full h-56"
                >
                  <Image
                    src={block.content?.url}
                    alt="creator image"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              )

            }

            if (block.type === "video") {

              const embedUrl =
                block.content?.url?.replace(
                  "watch?v=",
                  "embed/"
                )

              return (
                <iframe
                  key={block._id}
                  src={embedUrl}
                  className="w-full h-56 rounded-lg"
                  allowFullScreen
                />
              )

            }

            return null

          })}

        </div>

      </div>

    </div>

  )

}