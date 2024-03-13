const { v2 } = require("cloudinary");
const fs = require("fs");

v2.config({
  cloud_name: "drhpgk239",
  api_key: "699834795429935",
  api_secret: "z3dDaQ8b0swUJj0kSPYFRYSQZ2Q",
});


const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    console.log('inside cloudinary');
    const response = await v2.uploader.upload(localFilePath,{
        resource_type:"image"
    });

    console.log("File uploaded successfully ", response.url);
    // fs.unlinkSync(localFilePath);
    return response;
    
} catch (error) {
      fs.unlinkSync(localFilePath);
      return null;
    }
};

module.exports = uploadToCloudinary;
