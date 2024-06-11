import { connectToDB } from "@utils/database"
import Prompt from "@models/prompt";

export const GET = async (request,{params}) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find({
      creator : params.id
    }).populate('creator');
    
    return new Response(JSON.stringify(prompts),{status:200})
  } catch (error) {
    console.log('\x1b[31m Failed to Fetch all Prompts in users \x1b[0m',error);
    return new Response("Failed to Fetch all Prompts",{status:500})
    
  }
}