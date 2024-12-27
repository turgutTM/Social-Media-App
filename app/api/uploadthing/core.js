

import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";


const f = createUploadthing();


async function auth(req) {

 
  return { id: "userID" };
}

export const ourFileRouter = {

  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) {
       
        throw new UploadThingError("Unauthorized");
      }
    
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
  
      console.log("Image upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId };
    }),
};
